#!/usr/bin/env python

import unittest
from common import TestCase

class TestEventsApp(TestCase):
    name = "events"

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
