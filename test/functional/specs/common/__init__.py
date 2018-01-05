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

def has_attribute(attr):
    def has_attr(node):
        try:
            return hasattr(node, attr) and getattr(node, attr) is not None
        except NotImplementedError as _:
            return False
    return has_attr

def boolean_attribute(attr):
    def has_boolean_attr(node):
        return has_attribute(attr)(node) and getattr(node, attr)
    return has_boolean_attr

def has_caret_offset(node):
    return boolean_attribute("focused")(node) and has_attribute("caretOffset")(node)

INDENTATION = '  '
ALL_ATTRIBUTES = [
    { "name": "caretOffset", "applies": has_caret_offset, "value": lambda n: str(n.caretOffset) },
    { "name": "checked", "applies": boolean_attribute("checked"), "value": lambda _: "true" },
    { "name": "focusable", "applies": boolean_attribute("focusable"), "value": lambda _: "true" },
    { "name": "focused", "applies": boolean_attribute("focused"), "value": lambda _: "true" },
    { "name": "pressed", "applies": lambda n: n.getState().contains(pyatspi.STATE_PRESSED), "value": lambda _: "true" },
    { "name": "showing", "applies": boolean_attribute("showing"), "value": lambda _: "true" },
    { "name": "sensitive", "applies": boolean_attribute("sensitive"), "value": lambda _: "true" },
    { "name": "text", "applies": has_attribute("text"), "value": lambda n: n.text },
    { "name": "value", "applies": has_attribute("value"), "value": lambda n: n.value },
]

def do_dump(buffer, node, depth):
    role = node.roleName.replace(" ", "")
    attrs = [ '{}="{}"'.format(a["name"], a["value"](node)) for a in ALL_ATTRIBUTES if a["applies"](node) ]
    has_children = len(node.children) > 0

    opening_str = "<{role} {attrs}{self_closing}>\n".format(
        role=role,
        attrs=" ".join(attrs),
        self_closing="/" if not has_children else ""
    )
    buffer.write(INDENTATION * depth + opening_str)
    if has_children:
        for child in node.children:
            do_dump(buffer, child, depth + 1)
        buffer.write(INDENTATION * depth + "</{role}>\n".format(role=role))

def crawl(buffer, node):
    do_dump(buffer, node, 0)

class TestCase(unittest.TestCase):
    name = "unknown"

    def doDump(self, node):
        with StringIO() as tmp_file:
            crawl(tmp_file, node)
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
