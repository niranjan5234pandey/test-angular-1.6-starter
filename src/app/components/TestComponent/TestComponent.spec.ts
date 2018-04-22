import angular = require('angular');
import 'angular-mocks';
import { mmAngularModuleName } from '../../AngularModuleBootstraper';
import { TestComponent } from './TestComponent';

describe('TestComponent test suite', () => {

    let $compile;
    let $rootScope;
    let $q;
    let ctrl;
    let scope;
    let $componentController;
    let postServiceMock;
    let postServiceSpy;
    let element;

    // prepare mocked module
    beforeEach(function() {
        angular.mock.module(mmAngularModuleName);
    });

    // prepare common stuff
    beforeEach(inject((_$compile_, _$rootScope_: any, _$componentController_: any, _postsService_, _$q_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $componentController = _$componentController_;
        postServiceMock = _postsService_;
        $q = _$q_;
    }));

    beforeEach(() =>  {
        var deferred = $q.defer();
        deferred.resolve({id: 1, title: 'Some mocked post'});
        postServiceSpy = spyOn(postServiceMock , 'getPostDetail').and.returnValue(deferred.promise);
        scope = $rootScope.$new();
        element = angular.element('<test-component id="{{testID}}"></test-component>');
        scope.testID = 100;
        element = $compile(element)(scope);
        scope.$apply();
    });

    it('should render the text in main class', function() {
        expect(element).toBeDefined();
        let mainRootElement = angular.element(element[0].querySelector('.test-component'));
        expect(mainRootElement.text()).toBe('Test content 100');
    });

    it('should handle properly id to service call', () => {
        ctrl = $componentController('testComponent', null, {id: 100} );
        expect(ctrl.id).toBe(100);
        expect(postServiceSpy).toHaveBeenCalledTimes(1);
        expect(postServiceSpy).toHaveBeenCalledWith('100');
    });

});