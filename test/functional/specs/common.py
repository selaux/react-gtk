import unittest
from os import environ, makedirs
from os.path import dirname, join, exists
import sys
from sys import argv
from subprocess import Popen
from time import sleep
from io import StringIO
from dogtail.tree import *

BUNDLES_LOCATION = 'test-output/functional'
DUMPS_LOCATION = 'test/functional/dumps'
OUT_LOCATION = 'test-output' if 'OUT' not in environ else environ['OUT']
GJS = '/usr/bin/gjs'

def trap_stdout(function):
    saved_stdout = sys.stdout
    try:
        out = StringIO()
        sys.stdout = out
        function()
        output = out.getvalue().strip()
    finally:
        sys.stdout = saved_stdout
    return output

class TestCase(unittest.TestCase):
    name = "unknown"

    def assertDump(self, expected, node):
        expected_dump_filename = join(DUMPS_LOCATION, "{}/{}.dump".format(self.name, expected))
        got_dump_filename = join(OUT_LOCATION, "{}/{}.dump".format(self.name, expected))

        sleep(1)
        dump = trap_stdout(node.dump)

        directory = dirname(got_dump_filename)
        if not exists(directory):
            makedirs(directory)
        with open(got_dump_filename, 'w+') as f:
            f.write(dump)

        expected = None
        with open(expected_dump_filename, 'r') as f:
            expected = f.read()

        self.assertEqual(dump, expected, "\nGot:\n{}\nExpected:\n{}\n".format(dump, expected))

    def setUp(self):
        testApplication = '{}/{}Bundle.js'.format(BUNDLES_LOCATION, self.name)
        self.testApplicationProcess = Popen([GJS, testApplication])
        self.app = root.childNamed('react-gtk {} test'.format(self.name))

    def tearDown(self):
        self.testApplicationProcess.terminate()
        self.testApplicationProcess.poll()