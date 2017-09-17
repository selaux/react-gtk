const sinon = require('sinon');
const { expect } = require('chai');

const createReconciler = require('../../src/reconciler');

describe('reconciler', function () {
    const getDefaultImports = () => ({
        gi: {
            Gtk: {
                Application: sinon.stub()
            }
        }

    });
    const logStub = () => {};

    describe('preparing update', function () {
        it('should return null if props are equal', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports, {}, logStub);
            const oldProps = { props: 1 };
            const newProps = { props: 1 };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.equal(null);
        });

        it('should return null if only children differ', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports, {}, logStub);
            const oldProps = { props: 1, children: [ 2 ] };
            const newProps = { props: 1, children: [ 1 ] };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.equal(null);
        });

        it('should return set when a prop differs from old prop', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports, {}, logStub);
            const oldProps = { prop: 1, children: [ 2 ] };
            const newProps = { prop: 2, children: [ 1 ] };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.deep.equal({
                set: [
                    [ 'prop', 2 ]
                ],
                unset: []
            });
        });

        it('should return unset a prop was removed', function () {
            const imports = getDefaultImports();
            const Reconciler = createReconciler(imports, {}, logStub);
            const oldProps = { prop1: 1, prop2: 1 };
            const newProps = { prop1: 1 };

            expect(Reconciler.prepareUpdate(null, null, oldProps, newProps)).to.deep.equal({
                set: [],
                unset: [ 'prop2' ]
            });
        });
    });
});
