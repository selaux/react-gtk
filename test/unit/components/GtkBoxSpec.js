const sinon = require('sinon');
const { expect } = require('chai');

const injectGtkBox = require('../../../src/components/GtkBox');

describe('GtkBox', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Box: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    it('should instance GtkBox once', function () {
        const imports = getDefaultImports();
        const GtkBox = injectGtkBox(imports, logStub);

        const instance = {};
        imports.gi.Gtk.Box.returns(instance);

        const gotInstance = new GtkBox({});

        expect(imports.gi.Gtk.Box.callCount).to.equal(1);
        expect(gotInstance.instance).to.equal(instance);
    });

    it('should append children', function () {
        const imports = getDefaultImports();
        const GtkBox = injectGtkBox(imports, logStub);

        const instance = { add: sinon.spy(), get_children: sinon.stub().returns([]) };
        imports.gi.Gtk.Box.returns(instance);

        const gotInstance = new GtkBox({});
        gotInstance.appendChild({ instance: 'mychild' });

        expect(instance.add.callCount).to.equal(1);
        expect(instance.add.firstCall.args).to.deep.equal([ 'mychild' ]);
    });

    it('should move children to the end when they are appended and already in the list', function () {
        const imports = getDefaultImports();
        const GtkBox = injectGtkBox(imports, logStub);

        const childInstance = { my: 'child' };
        const instance = {
            add: sinon.spy(),
            get_children: sinon.stub().returns([ childInstance ]),
            reorder_child: sinon.stub()
        };
        imports.gi.Gtk.Box.returns(instance);

        const gotInstance = new GtkBox({});
        gotInstance.appendChild({ instance: childInstance });

        expect(instance.add.callCount).to.equal(0);
        expect(instance.reorder_child.callCount).to.equal(1);
        expect(instance.reorder_child.firstCall.args).to.deep.equal([ childInstance, -1 ]);
    });

    it('should insert children', function () {
        const imports = getDefaultImports();
        const GtkBox = injectGtkBox(imports, logStub);

        const childInstance = { my: 'child' };
        const childAfter = { after: 'child' };
        const otherInstance = { other: 'child' };
        const instance = {
            add: sinon.spy(),
            get_children: sinon.stub().returns([ otherInstance, otherInstance, childAfter ]),
            reorder_child: sinon.stub()
        };
        imports.gi.Gtk.Box.returns(instance);

        const gotInstance = new GtkBox({});
        gotInstance.insertBefore({ instance: childInstance }, { instance: childAfter });

        expect(instance.add.callCount).to.equal(1);
        expect(instance.add.firstCall.args).to.deep.equal([ childInstance ]);
        expect(instance.reorder_child.callCount).to.equal(1);
        expect(instance.reorder_child.firstCall.args).to.deep.equal([ childInstance, 2 ]);
    });

    it('should only reorder when inserting children that already exist', function () {
        const imports = getDefaultImports();
        const GtkBox = injectGtkBox(imports, logStub);

        const childInstance = { my: 'child' };
        const childAfter = { after: 'child' };
        const otherInstance = { other: 'child' };
        const instance = {
            add: sinon.spy(),
            get_children: sinon.stub().returns([ childAfter, otherInstance, otherInstance, childInstance ]),
            reorder_child: sinon.stub()
        };
        imports.gi.Gtk.Box.returns(instance);

        const gotInstance = new GtkBox({});
        gotInstance.insertBefore({ instance: childInstance }, { instance: childAfter });

        expect(instance.add.callCount).to.equal(0);
        expect(instance.reorder_child.callCount).to.equal(1);
        expect(instance.reorder_child.firstCall.args).to.deep.equal([ childInstance, 0 ]);
    });
});
