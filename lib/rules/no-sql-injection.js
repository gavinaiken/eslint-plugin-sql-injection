const debug = require('debug')('eslint-plugin-sql-injection:rule:no-sql-injection');

const defaultQueryFunctionNames = [ 'query' ];

function callIsAQuery(node, queryFunctionNames) {
    var callee = node.callee;
    return callee &&
        callee.property &&
        callee.property.type === 'Identifier' &&
        queryFunctionNames.includes(callee.property.name);
}

// eg q += "from blah";
function isAnAssignmentConcat(node) {
    return node.type === 'AssignmentExpression' &&
        node.operator === '+=';
}

function isAConcatenation(node) {
    return node.type === 'BinaryExpression' &&
        node.operator === '+';
}

function queryVariableUsesConatenation(node, context) {
    var args = node.arguments;
    var variableName = args[0].name;
    var scope = context.getScope();
    var variable = scope.variables.find(v => v.name === variableName);
    if (!variable) {
        return false;
    }

    var anyVariableDefinitionIsAConcat = variable.defs.some(def =>
        def.node &&
        def.node.init &&
        isAConcatenation(def.node.init)
    );
    if (anyVariableDefinitionIsAConcat) {
        return true;
    }

    debug(variable);

    var anyVariableReferenceIsAConcat = variable.references.some(ref =>
        ref.writeExpr &&
        isAConcatenation(ref.writeExpr)
    );
    if (anyVariableReferenceIsAConcat) {
        return true;
    }

    var anyVariableReferenceIsAnAssignmentConcat = variable.references.some(ref =>
        ref.writeExpr &&
        ref.writeExpr.parent &&
        isAnAssignmentConcat(ref.writeExpr.parent)
    );
    return anyVariableReferenceIsAnAssignmentConcat;
}

function queryUsesConcatenation(node, context) {
    var queryHasArgs = node.arguments &&
        Array.isArray(node.arguments) &&
        node.arguments.length > 0;

    if (!queryHasArgs) {
        return false;
    }

    var args = node.arguments;
    var argIsConcat = isAConcatenation(args[0]);

    if (argIsConcat) {
        return true;
    }

    var argIsIdentifier = args[0].type === 'Identifier';
    if (!argIsIdentifier) {
        // what is it!?
        return false;
    }

    return queryVariableUsesConatenation(node, context);
}

module.exports = function (context) {
    var options = context.options[0] || {};
    var queryFunctionNames = Array.isArray(options.queryFunctionNames) ? options.queryFunctionNames : defaultQueryFunctionNames;

    return {
        CallExpression: function (node) {
            var isAQuery = callIsAQuery(node, queryFunctionNames);
            if (!isAQuery) {
                return;
            }
            var isAConcatenation = queryUsesConcatenation(node, context);
            if (!isAConcatenation) {
                // debug(node);
                return;
            }
            
            return context.report({
                node: node.arguments[0],
                message: 'Sql query uses string concatenation'
            });
        }
    };
};
