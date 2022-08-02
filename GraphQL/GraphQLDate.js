const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return (value.toISOString()).substring(0,10); 
    },
    parseValue(value) {
        
        //return new Date(value); // Convert incoming integer to Date
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },
    parseLiteral(ast) {
        if(ast.kind == Kind.STRING) {
            //return new Date(ast.value) 
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
        }
        
    },
  });

module.exports = dateScalar;  