'use strict';
ReportApp.factory('TaskTypeService', function ($http) {
    var TaskTypeServiceURI = BaseURL;
    var TaskTypeServiceFactory = {};

    TaskTypeServiceFactory.GetAllTaskType = function () {
        var result = $http.get(TaskTypeServiceURI + 'TaskType/GetAllTaskType');
        return result;
    }

    TaskTypeServiceFactory.GetAllTaskTypeById = function (TaskTypeId) {
        var result = $http.get(TaskTypeServiceURI + 'TaskType/GetAllTaskType?TaskTypeId=' + TaskTypeId);
        return result;
    }
    TaskTypeServiceFactory.AddTaskType = function (TaskType) {
        return $http.post(TaskTypeServiceURI + 'TaskType/AddTaskType', TaskType);
    }

    TaskTypeServiceFactory.ModifyTaskType = function (TaskType) {
        return $http.post(TaskTypeServiceURI + 'TaskType/ModifyTaskType', TaskType);
    }

    TaskTypeServiceFactory.DeleteTaskType = function (TaskType) {
        return $http.post(TaskTypeServiceURI + 'TaskType/DeleteTaskType', TaskType);
    }

    return TaskTypeServiceFactory;
});

