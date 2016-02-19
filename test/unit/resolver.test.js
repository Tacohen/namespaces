/* eslint-disable no-unused-expressions, func-names  */

import { expect } from 'chai';
import Container from '../../src/container';

describe('Resolver', function() {
    let container = null;

    beforeEach(function() {
        container = new Container();
    });

    describe('.resolve', () => {
        context('empty container', () => {
            it('should throw error', () => {
                const resolve = () => {
                    container.resolve('foo');
                };

                expect(resolve).to.throw();
            });
        });

        describe('#const', () => {
            context('plain types', () => {
                it('should successfully resolve function', () => {
                    const module = function foo() { return 'bar'; };
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                    expect(found).to.eql(found2);
                    expect(found() === 'bar').to.be.true;
                });

                it('should successfully resolve object', () => {
                    const module = { name: 'bar' };
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve number', () => {
                    const module = 10;
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve string', () => {
                    const module = 'foo';
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve array', () => {
                    const module = [1, 2, 3];
                    container.const('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });
            });
        });

        describe('#value', () => {
            context('plain types', () => {
                it('should successfully resolve object', () => {
                    const module = { name: 'bar' };
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve number', () => {
                    const module = 10;
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve string', () => {
                    const module = 'foo';
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });

                it('should successfully resolve array', () => {
                    const module = [1, 2, 3];
                    container.value('value', module);
                    const found = container.resolve('value');
                    const found2 = container.resolve('value');
                    expect(found).to.equal(module);
                    expect(found2).to.equal(module);
                });
            });
            context('constructor', () => {
                context('without dependencies', () => {
                    it('should successfully resolved', () => {
                        let index = 0;
                        container.value('value', function User() {
                            index += 1;
                            this.name = `foo_${index}`;
                            this.surname = `bar_${index}`;
                        });

                        const found = container.resolve('value');
                        const found2 = container.resolve('value');
                        expect(found).to.exist;
                        expect(found2).to.exist;
                        expect(found).to.not.equal(found2);
                        expect(found.name).to.exist;
                        expect(found.surname).to.exist;
                    });
                });
                context('with dependencies', () => {
                    it('should successfully resolved', () => {
                        let index = 0;
                        container.value('group', function Group() {
                            this.accounts = [];
                        });
                        container.value('user', ['group'], function User(group) {
                            index += 1;
                            this.name = `foo_${index}`;
                            this.surname = `bar_${index}`;
                            this.group = group;
                        });

                        const found = container.resolve('user');
                        expect(found).to.exist;
                        expect(found.group).to.exist;
                        expect(found.group.accounts).to.exist;
                    });
                });
            });
        });

        describe('#service', () => {
            context('without dependencies', () => {
                it('should resolve single service', () => {
                    container.service('http', function HttpService() {
                        this.get = () => {};
                        this.post = () => {};
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                });
            });
            context('with dependencies', () => {
                it('should resolve single service', () => {
                    container.value('http-transport', function HttpTransport() {});

                    container.service('settings', function Settings() {});

                    container.service('http', ['http-transport', 'settings'], function HttpService(transport, settings) {
                        this.settings = settings;
                        this.transport = transport;
                        this.get = () => {};
                        this.post = () => {};
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                    expect(found.settings).to.exist;
                    expect(found.transport).to.exist;
                });
            });
        });

        describe('#factory', () => {
            context('without dependencies', () => {
                it('should resolve single service', () => {
                    container.factory('http', function HttpServiceFactory() {
                        return new function HttpService() {
                            this.get = () => {};
                            this.post = () => {};
                        };
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                });
            });
            context('with dependencies', () => {
                it('should resolve single service', () => {
                    container.value('http-transport', function HttpTransport() {});

                    container.service('settings', function Settings() {});

                    container.factory('http', ['http-transport', 'settings'], function HttpServiceFactory(transport, settings) {
                        return new function HttpService() {
                            this.settings = settings;
                            this.transport = transport;
                            this.get = () => {};
                            this.post = () => {};
                        };
                    });

                    const found = container.resolve('http');
                    const found2 = container.resolve('http');

                    expect(found).to.exist;
                    expect(found).to.equal(found2);
                    expect(found.settings).to.exist;
                    expect(found.transport).to.exist;
                });
            });
        });

        describe('in namespace', () => {
            describe('#value', () => {
                context('same name', () => {
                    it('should resolve from different namespaces', () => {
                        container.value('value', 1);
                        container.namespace('consts').value('value', 2);

                        expect(container.resolve('value')).to.equal(1);
                        expect(container.resolve('consts/value')).to.equal(2);
                    });
                });

                context('as dependency', () => {
                    it('should resolve', () => {
                        container.namespace('consts').value('value', 1);
                        container.namespace('models').value('user', ['consts/value'], function User(value) {
                            this.value = value;
                        });

                        const user = container.resolve('models/user');
                        expect(user).to.exist;
                        expect(user.value).to.equal(1);
                    });
                });
            });
            describe('#factory', () => {
                context('same name', () => {
                    it('should resolve from different namespaces', () => {
                        container.factory('service', function factoryA() {
                            return {name: 'A'};
                        });
                        container.namespace('services').factory('service', function factoryB() {
                            return {name: 'B'};
                        });

                        const serviceA = container.resolve('service');
                        const serviceB = container.resolve('services/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceA).to.not.equal(serviceB);
                    });
                });
                context('as dependency', () => {
                    it('should resolve', () => {
                        container.namespace('services/api').factory('service', function factoryA() {
                            return {name: 'A'};
                        });
                        container.namespace('services').factory('service', ['services/api/service'], function factoryB(serviceA) {
                            return {name: 'B', api: serviceA};
                        });

                        const serviceB = container.resolve('services/service');
                        const serviceA = container.resolve('services/api/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceB.api).to.equal(serviceA);
                    });
                });
            });
            describe('#service', () => {
                context('same name', () => {
                    it('should resolve from different namespaces', () => {
                        container.service('service', function ServiceA() {
                        });
                        container.namespace('services').service('service', function ServiceB() {
                        });

                        const serviceA = container.resolve('service');
                        const serviceB = container.resolve('services/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceA).to.not.equal(serviceB);
                    });
                });
                context('as dependency', () => {
                    it('should resolve', () => {
                        container.namespace('services/api').service('service', function ServiceA() {});
                        container.namespace('services').service('service', ['services/api/service'], function ServiceB(serviceA) {
                            this.api = serviceA;
                        });

                        const serviceB = container.resolve('services/service');
                        const serviceA = container.resolve('services/api/service');
                        expect(serviceA).to.exist;
                        expect(serviceB).to.exist;
                        expect(serviceB.api).to.equal(serviceA);
                    });
                });
            });
        });

        // describe('circular dependency', () => {
        //    it('should throw during resolving', () => {
        //        const self = () => {
        //            container.register().value('value1', ['value1'], 1);
        //            container.resolve('value1');
        //        };
        //        const shallow = () => {
        //            container.register().value('value1', ['value2'], 1);
        //            container.register().value('value2', ['value1'], 2);
        //            container.resolve('value1');
        //            container.resolve('value2');
        //        };
        //        const deep = () => {
        //            container.register().value('a', ['b', 'd'], 'a');
        //            container.register().value('b', ['c', 'e'], 'b');
        //            container.register().value('c', ['e', 'd'], 'c');
        //            container.register().value('d', ['b'], 'd');
        //            container.register().value('e', 'e');
        //
        //            container.resolve('a');
        //        };
        //
        //        expect(self).to.throw(ReferenceError);
        //        expect(shallow).to.throw(ReferenceError);
        //        expect(deep).to.throw(ReferenceError);
        //    });
        // });
    });
    describe('.resolveAll', () => {
        context('empty container', () => {
            it('should throw error', () => {
                expect(() => {
                    container.resolveAll('foo');
                }).to.throw();
            });
        });

        context('not empty container', () => {
            it('should resolve all modules from particular namespace', () => {
                const foo = container.namespace('foo');
                foo.service('A', function() { this.name = 'A'; });
                foo.service('B', ['foo/A'], function() { this.name = 'B'; });
                foo.service('C', ['foo/B'], function() { this.name = 'C'; });
                foo.service('D', ['foo/B', 'foo/C'], function() { this.name = 'D'; });

                const bar = container.namespace('bar');
                bar.service('E', ['foo/A'], function() { this.name = 'E'; });
                bar.service('F', ['bar/E', 'foo/C'], function() { this.name = 'F'; });

                const resolved = container.resolveAll('bar');
                const arr = [];

                for (const name in resolved) {
                    if (resolved.hasOwnProperty(name)) {
                        arr.push({
                            name: name,
                            value: resolved[name]
                        });
                    }
                }

                expect(arr.length).to.equal(2);
            });
        });
    });
});

/* eslint-enable no-unused-expressions, func-names  */
