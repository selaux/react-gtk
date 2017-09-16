#!/usr/bin/env python

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

class TestEventsApp(unittest.TestCase):
    name = "events"

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

        self.assertEqual(dump, expected)

    def setUp(self):
        testApplication = '{}/{}Bundle.js'.format(BUNDLES_LOCATION, self.name)
        self.testApplicationProcess = Popen([GJS, testApplication])
        self.app = root.childNamed('react-gtk {} test'.format(self.name))

    def tearDown(self):
        self.testApplicationProcess.terminate()
        self.testApplicationProcess.poll()

    def test_signal_registration(self):
        increaseButton = self.app.childNamed('Increase')

        for i in range(0, 2):
            increaseButton.click()
        self.assertDump('signal_registration', self.app)

    def test_signal_update(self):
        increaseButton = self.app.childNamed('Increase')
        increaseIncrementButton = self.app.childNamed('Increase Increment')

        increaseIncrementButton.click()
        for i in range(0, 2):
            increaseButton.click()
        self.assertDump('signal_update', self.app)

    def test_signal_removal(self):
        increaseButton = self.app.childNamed('Increase')
        disableButton = self.app.childNamed('Disable Event')

        disableButton.click()
        for i in range(0, 2):
            increaseButton.click()
        self.assertDump('signal_removal', self.app)

if __name__ == '__main__':
    unittest.main()
