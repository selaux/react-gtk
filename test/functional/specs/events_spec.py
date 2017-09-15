from os import environ, makedirs
from os.path import dirname, join, exists
import sys
from sys import argv
from subprocess import Popen
from time import sleep
from io import StringIO

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
    filename = join(dirname(__file__), '../dumps/', expected_file)

    if len([ x for x in argv if x == '--dump' ]) == 0:
        with open(filename, 'r') as f:
            expected = f.read()
            assert expected == trap_stdout(node.dump)
    else:
        directory = dirname(filename)
        if not exists(directory):
            makedirs(directory)
        sleep(0.5)
        with open(filename, 'w+') as f:
            sleep(0.5)
            f.write(trap_stdout(node.dump))

spiBusProcess = None
testApplicationProcess = None
displayProcess = None

displayId = ':10'
displayEnv = { **dict(environ), 'DISPLAY': displayId }

try:
    displayProcess = Popen([environ['XEPHYR'], '-ac', '-br', displayId])
    sleep(1)

    # Setup a11y
    spiBusProcess = Popen([environ['AT_SPI_BUS_LAUNCHER']], env=displayEnv)
    sleep(1)

    from dogtail.tree import *

    appName = 'events'

    # Setup Application
    testApplication = '{}/functional/{}Bundle.js'.format(join(dirname(__file__), '../../../test-output'), appName)
    testApplicationProcess = Popen(['gjs', testApplication], env=displayEnv)

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
    if spiBusProcess is not None:
        spiBusProcess.terminate()
        spiBusProcess.poll()
    if displayProcess is not None:
        displayProcess.terminate()
        displayProcess.poll()
