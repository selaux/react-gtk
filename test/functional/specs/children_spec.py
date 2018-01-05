#!/usr/bin/env python

import unittest
from common import TestCase

class TestChildrenApp(TestCase):
    name = "children"

    def test_children_reordering(self):
        downButton = self.app.childNamed('DOWN')

        for i in range(0, 2):
            downButton.click()
        self.assertDump('reordering', self.app)

    def test_children_removal(self):
        remove1Button = self.app.childNamed('R1')
        remove3Button = self.app.childNamed('R3')

        remove1Button.click()
        remove3Button.click()

        self.assertDump('removal', self.app)

    def test_children_readding(self):
        remove3Button = self.app.childNamed('R3')

        for i in range(0, 2):
            remove3Button.click()

        self.assertDump('readding', self.app)

if __name__ == '__main__':
    unittest.main()
