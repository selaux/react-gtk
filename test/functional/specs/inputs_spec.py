#!/usr/bin/env python

import unittest
from common import TestCase

class TestInputsApp(TestCase):
    name = "inputs"

    def test_toggle_button_event(self):
        toggleButton = self.app.childNamed('Toggle Me')
        toggleButton.click()

        self.assertDump('toggle_button_clicked', self.app)

    def test_toggle_button_event(self):
        toggleButton = self.app.childNamed('Activate Toggle')
        toggleButton.click()

        self.assertDump('toggle_button_external_toggle', self.app)

if __name__ == '__main__':
    unittest.main()
