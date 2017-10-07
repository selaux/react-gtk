#!/usr/bin/env python

import unittest
import dogtail.predicate as predicate
import dogtail.rawinput as rawinput
from common import TestCase

def find_switch(app):
    return app.findChildren(predicate.GenericPredicate(roleName='toggle button'))[1]

class TestInputsApp(TestCase):
    name = "inputs"

    def test_toggle_clicked(self):
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

    def test_switch_clicked(self):
        switch = find_switch(self.app)
        switch.click()

        self.assertDump('switch_clicked', self.app)

    def test_switch_external_toggle(self):
        activateButton = self.app.childNamed('Activate Switch')
        activateButton.click()

        self.assertDump('switch_external_toggle', self.app)

    def test_switch_fixed(self):
        fixButton = self.app.childNamed('Fix Values')
        fixButton.click()

        switch = find_switch(self.app)
        switch.click()

        self.assertDump('switch_fixed', self.app)

    def test_scale_moved(self):
        scale = self.app.findChild(predicate.GenericPredicate(roleName='slider'))
        scale.grabFocus()
        rawinput.pressKey('Right')
        rawinput.pressKey('Right')
        rawinput.pressKey('Right')


        self.assertDump('scale_moved', self.app)

    def test_scale_external_toggle(self):
        activateButton = self.app.childNamed('Set Scale')
        activateButton.click()

        self.assertDump('scale_external_toggle', self.app)

    def test_scale_fixed(self):
        fixButton = self.app.childNamed('Fix Values')
        fixButton.click()

        scale = self.app.findChild(predicate.GenericPredicate(roleName='slider'))
        scale.grabFocus()
        rawinput.pressKey('Right')
        rawinput.pressKey('Right')
        rawinput.pressKey('Right')

        self.assertDump('scale_fixed', self.app)

if __name__ == '__main__':
    unittest.main()
