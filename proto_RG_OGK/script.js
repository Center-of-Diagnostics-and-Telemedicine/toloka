//название групп в левой колонке чекбоксов
const groups = {
    "group_1": "Группа 1",
    "group_2": "Группа 2",
    "group_3": "Группа 3",
    "group_4": "Группа 4",
    "group_5": "Группа 5",
    "another": "Другое"

};
//связь чекбоксов групп с чекбоксами правой колонки (патологиями)
const checkboxes = {
    "group_1": ["pathology_1","pathology_2", "pathology_3","pathology_4","pathology_5", "pathology_6","pathology_7","pathology_8", "pathology_9", "pathology_10"],
    "group_2": ["pathology_11","pathology_12", "pathology_13","pathology_14","pathology_15", "pathology_16","pathology_17","pathology_18", "pathology_19", "pathology_20"],
    "group_3": ["pathology_21","pathology_22", "pathology_23","pathology_24","pathology_25", "pathology_26","pathology_27","pathology_28", "pathology_29", "pathology_30"],
    "group_4": ["pathology_31","pathology_32", "pathology_33","pathology_34","pathology_35", "pathology_36","pathology_37","pathology_38", "pathology_39", "pathology_40"],
    "group_5": ["pathology_41","pathology_42", "pathology_43","pathology_44","pathology_45", "pathology_46","pathology_47","pathology_48", "pathology_49", "pathology_50"],

};
//название патологий
const pathology = {
    "pathology_1": "Патология 1",
    "pathology_2": "Патология 2",
    "pathology_3": "Патология 3",
    "pathology_4": "Патология 4",
    "pathology_5": "Патология 5",
    "pathology_6": "Патология 6",
    "pathology_7": "Патология 7",
    "pathology_8": "Патология 8",
    "pathology_9": "Патология 9",
    "pathology_10": "Патология 10",
    "pathology_11": "Патология 11",
    "pathology_12": "Патология 12",
    "pathology_13": "Патология 13",
    "pathology_14": "Патология 14",
    "pathology_15": "Патология 15",
    "pathology_16": "Патология 16",
    "pathology_17": "Патология 17",
    "pathology_18": "Патология 18",
    "pathology_19": "Патология 19",
    "pathology_20": "Патология 20",
    "pathology_21": "Патология 21",
    "pathology_22": "Патология 22",
    "pathology_23": "Патология 23",
    "pathology_24": "Патология 24",
    "pathology_25": "Патология 25",
    "pathology_26": "Патология 26",
    "pathology_27": "Патология 27",
    "pathology_28": "Патология 28",
    "pathology_29": "Патология 29",
    "pathology_30": "Патология 30",
    "pathology_31": "Патология 31",
    "pathology_32": "Патология 32",
    "pathology_33": "Патология 33",
    "pathology_34": "Патология 34",
    "pathology_35": "Патология 35",
    "pathology_36": "Патология 36",
    "pathology_37": "Патология 37",
    "pathology_38": "Патология 38",
    "pathology_39": "Патология 39",
    "pathology_40": "Патология 40",
    "pathology_41": "Патология 41",
    "pathology_42": "Патология 42",
    "pathology_43": "Патология 43",
    "pathology_44": "Патология 44",
    "pathology_45": "Патология 45",
    "pathology_46": "Патология 46",
    "pathology_47": "Патология 47",
    "pathology_48": "Патология 48",
    "pathology_49": "Патология 49",
    "pathology_50": "Патология 50"
};
exports.Assignment = extend(TolokaAssignment, function (options) {
    TolokaAssignment.call(this, options);
}, {
    provideSolutions(strategy = function(solutions) {
        this.getSandboxChannel().triggerOut('assignment:submit', { solutions, assignmentId: this.getId() });
    }) {
        const solutions = this.getTaskSuite().getSolutions();

        var task = this,
            document = this.getTaskSuite().getDOMElement();
        Promise.resolve(this.getTaskSuite().validate(solutions))
            .then((errors) => {
            if (!errors) {
            //увеличиваем счетчик при успешном сабмите таска
            strategy.call(this, solutions);
        } else {
            this.getSandboxChannel().triggerOut('assignment:validation:fail', errors);
            document.querySelector(".task__error").scrollIntoView({behavior: "smooth"});
        }
    });
    }
});
exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
}, {
    //метод добавления ошибки
    addError: function(message, field, errors) {
        errors ||
        (errors = {
            task_id: this.getOptions().task.id,
            errors: {}
        });
        errors.errors[field] = {
            message: message
        };

        return errors;
    },
    /*onValidationFail: function(errors) {
      let document = this.getDOMElement();

    },*/
    //валидация
    validate: function (solution) {
        let errors = null,
            document = this.getDOMElement(),
            task = this,
            //выбираем все отмеченные чекбоксы из выходных данных
            checkedGroups = _.pick(solution.output_values, function (value, key) {
                return (/^group_/i.test(key) && value);
            }),
            checkedPathology = _.pick(solution.output_values, function (value, key) {
                return (/^pathology_/i.test(key) && value);
            }),
            _checkedGroups = [],
            _checkedPathology = [];

        if(!solution.output_values.result) {
            errors = this.addError("Описание соответствует заключению?", "__TASK__", errors);
        } else
        if(!solution.output_values.pathology &&solution.output_values.result !=="notEqual") {
            errors = this.addError("Есть ли патологии?", "__TASK__", errors);
        } else
        //если не выбрано значение из группы, показываем ошибку
        if(solution.output_values.pathology === "yes" && _.isEmpty(checkedGroups) && !solution.output_values.another &&solution.output_values.result !=="notEqual") {
            errors = this.addError("Выберите значение из группы", "__TASK__", errors);
        } else
        if(solution.output_values.pathology === "yes" && (_.isEmpty(checkedPathology)&& !solution.output_values.comment) &&solution.output_values.result !=="notEqual") {
            errors = this.addError("Выберите хотя бы одну патологию из списка или оставьте комментарий", "__TASK__", errors);

        }

       if(!errors) {
           //и пушим их в массивы выходных данных
           for (let key in checkedGroups) {
               _checkedGroups.push(groups[key]);
           }
           for (let key in checkedPathology) {
               _checkedPathology.push(pathology[key]);
           }
           //устанавливаем нужные значения
           task.setSolutionOutputValue("groups", _checkedGroups);
           task.setSolutionOutputValue("pathologyList", _checkedPathology);
           //удаляем ненужные ключи
           for(let key in solution.output_values) {
               if(/^group_|^pathology_/.test(key)) {
                   delete solution.output_values[key];
               }
           }
           delete solution.output_values.another;
           if(solution.output_values.result==="notEqual") {
               /*task.setSolutionOutputValue("groups", []);*/ solution.output_values.groups = [];
               /*task.setSolutionOutputValue("pathologyList", []);*/ solution.output_values.pathologyList = [];
               /*task.setSolutionOutputValue("comment", "");*/ solution.output_values.comment = "";
           }

       }
        console.log(solution.output_values);
        return errors || null;
    },
    
    getTemplateData: function () {
        let data = TolokaHandlebarsTask.prototype.getTemplateData.apply(this, arguments);

        data.checkboxes = checkboxes;
        data.groups = groups;
        /*console.log(data);*/
        return data;
    },
    onRender: function() {

        let _document = this.getDOMElement(),
            root = $(this.getDOMElement());

    },
    setSolution: function(solution) {
        let groups = _.pick(solution.output_values, function (value,key) {
                return (/^group/i.test(key))
            }),
            document = $(this.getDOMElement());
        for (let key in groups) {
            if(groups[key]) {
                document.find('.'+key).show("slow");
            } else {
                document.find('.'+key).hide("slow");
            }
        }
        if(solution.output_values.result==="equal") {
            document.find('._pathology').show("slow");
        }
        if(solution.output_values.another) {
            document.find('.comment').show("slow");
        } else {
            document.find('.comment').hide("slow");
        }
        if(solution.output_values.pathology === "yes" && solution.output_values.result==="equal") {
            document.find('.choose').show("slow").css("display","flex");
        } else {
            document.find('.choose').hide("slow");
        }
        if(solution.output_values.result==="notEqual") {
            document.find('.choose,._pathology').hide("slow");
        } /*else if(solution.output_values.result==="equal"){
            document.find('.choose').show("slow");
        }*/
    }
});

function extend(ParentClass, constructorFunction, prototypeHash) {
    constructorFunction = constructorFunction || function () {};
    prototypeHash = prototypeHash || {};
    if (ParentClass) {
        constructorFunction.prototype = Object.create(ParentClass.prototype);
    }
    for (var i in prototypeHash) {
        constructorFunction.prototype[i] = prototypeHash[i];
    }
    return constructorFunction;
}
Handlebars.registerHelper("_label", function(value, options)
{
    return pathology[value];
});

Handlebars.registerHelper("legend", function(value, options)
{
    return groups[value];
});