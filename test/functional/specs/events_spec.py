#!/usr/bin/env python

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

def check_against_dump(expected_file, node):
    filename = join(DUMPS_LOCATION, expected_file)

    if len([ x for x in argv if x == '--dump' ]) == 0:
        sleep(1)
        with open(filename, 'r') as f:
            expected = f.read()
            assert expected == trap_stdout(node.dump)
    else:
        sleep(1)
        directory = dirname(filename)
        if not exists(directory):
            makedirs(directory)
        with open(filename, 'w+') as f:
            f.write(trap_stdout(node.dump))

testApplicationProcess = None
try:
    appName = 'events'

    # Setup Application
    testApplication = '{}/{}Bundle.js'.format(BUNDLES_LOCATION, appName)
    testApplicationProcess = Popen([GJS, testApplication])

    app = root.childNamed('react-gtk {} test'.format(appName))

    increaseButton = app.childNamed('Increase')
    increaseIncrementButton = app.childNamed('Increase Increment')
    disableButton = app.childNamed('Disable Event')

    for i in range(0, 2):
        increaseButton.click()
    check_against_dump('events/increment1.dump', app)

    increaseIncrementButton.click()
    for i in range(0, 2):
        increaseButton.click()
    check_against_dump('events/increment2.dump', app)

    disableButton.click()
    for i in range(0, 2):
        increaseButton.click()
    check_against_dump('events/final.dump', app)

finally:
    if testApplicationProcess is not None:
        testApplicationProcess.terminate()
        testApplicationProcess.poll()
