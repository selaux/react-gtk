import unittest
from os import environ, makedirs
from os.path import dirname, join, exists
import pyatspi
from subprocess import Popen
from time import sleep
from io import StringIO
from dogtail.tree import *

BUNDLES_LOCATION = 'test-output/functional'
DUMPS_LOCATION = 'test/functional/dumps'
OUT_LOCATION = 'test-output' if 'OUT' not in environ else environ['OUT']
GJS = '/usr/bin/gjs'

SPACER = ' '

ALL_STATES = [
    [ lambda n: n.showing, "showing" ],
    [ lambda n: n.sensitive, "sensitive" ],
    [ lambda n: n.focusable, "focusable" ],
    [ lambda n: n.checked, "checked" ],
    [ lambda n: n.getState().contains(pyatspi.STATE_PRESSED), "pressed" ],
]

def dump_state(buffer, node, depth):
    states = [ n[1] for n in ALL_STATES if n[0](node) ]
    buffer.write(str(SPACER * depth) + '[states | ' + str.join(' | ', states) + str(']\n'))

def do_dump(buffer, item, depth):
    buffer.write(str(SPACER * depth) + str(item) + str('\n'))

def crawl(buffer, node, depth):
    do_dump(buffer, node, depth)
    dump_state(buffer, node, depth)

    actions_keys = list(node.actions.keys())
    actions_keys.sort()
    for action in actions_keys:
        do_dump(buffer, node.actions[action], depth + 1)
    for child in node.children:
        crawl(buffer, child, depth + 1)

class TestCase(unittest.TestCase):
    name = "unknown"

    def doDump(self, node):
        with StringIO() as tmp_file:
            crawl(tmp_file, node, 0)
            return tmp_file.getvalue().rstrip()

    def assertDump(self, expected, node):
        expected_dump_filename = join(DUMPS_LOCATION, "{}/{}.dump".format(self.name, expected))
        got_dump_filename = join(OUT_LOCATION, "{}/{}.dump".format(self.name, expected))

        sleep(1)
        dump = self.doDump(node)

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