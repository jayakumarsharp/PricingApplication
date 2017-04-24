'use strict';
ReportApp.factory('BaseSkillService', function ($http) {
    var BaseSkillServiceURI = BaseURL;
    var BaseSkillServiceFactory = {};

    BaseSkillServiceFactory.GetAllBaseSkill = function () {
        var result = $http.get(BaseSkillServiceURI + 'BaseSkill/GetAllBaseSkill');
        return result;
    }

    BaseSkillServiceFactory.GetAllBaseSkillById = function (Id) {
        var result = $http.get(BaseSkillServiceURI + 'BaseSkill/GetAllBaseSkill?Id=' + Id);
        return result;
    }
    BaseSkillServiceFactory.AddBaseSkill = function (BaseSkill) {
        return $http.post(BaseSkillServiceURI + 'BaseSkill/AddBaseSkill', BaseSkill);
    }

    BaseSkillServiceFactory.ModifyBaseSkill = function (BaseSkill) {
        return $http.post(BaseSkillServiceURI + 'BaseSkill/ModifyBaseSkill', BaseSkill);
    }

    BaseSkillServiceFactory.DeleteBaseSkill = function (BaseSkill) {
        return $http.post(BaseSkillServiceURI + 'BaseSkill/DeleteBaseSkill', BaseSkill);
    }

    return BaseSkillServiceFactory;
});

