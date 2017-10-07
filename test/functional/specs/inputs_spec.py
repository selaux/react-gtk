#!/usr/bin/env python

import unittest
from common import TestCase

class TestInputsApp(TestCase):
    name = "inputs"

    def test_toggle_button_event(self):
        toggleButton = self.app.childNamed('Toggle Me')
        toggleButton.click()

        self.assertDump('toggle_button_clicked', self.app)

    def test_toggle_external_toggle(self):
        activateButton = self.app.childNamed('Activate Toggle')
        activateButton.click()

        self.assertDump('toggle_button_external_toggle', self.app)

    def test_toggle_fixed(self):
        fixButton = self.app.childNamed('Fix Values')
        fixButton.click()

        toggleButton = self.app.childNamed('Toggle Me')
        toggleButton.click()

        self.assertDump('toggle_button_fixed', self.app)

if __name__ == '__main__':
    unittest.main()
