
const {Tokenizer} = require('./tokenizer');

// TODO: Add different factories for ast nodes

// 1. AST

// 2. S-Expression AST



class Parser {

    constructor(){
        this._string = '';
        this._tokenizer = new Tokenizer();
    }

    /**
     * parses a string into an AST
     */
    parse(string){
        this._string = string;
        this._tokenizer.init(string);

        // Prime the tokenizer to obtain the first
        // token which is our lookahead. The lookahead is
        // used for predictive parsing - LL1 parser

        this._lookahead = this._tokenizer.getNextToken();

        // Parse recursively starting from the main
        // entry point, the Program:

        return this.Program();
    } 

    /**
     * Main entry point.
     * 
     * Program
     *  : LITERAL
     *  ; 
     */
    Program(){
        return {
            type: 'Program',
            body: this.StatementList()
        };
    }

    /**
     * StatementList
     * : Statement
     * | StatementList Statement
     * ;
     */

    StatementList(stopLookahead = null){
        const statements = [];
        while(this._lookahead != null && this._lookahead.type !== stopLookahead){
            statements.push(this.Statement());
        }
        return statements;
    }


    /**
     * Statement
     *  :ExpressionStatement
     *  :BlockStatement
     *  :EmptyStatement
     *  ;
     */
    Statement(){
        switch(this._lookahead.type){
            case ";": return this.EmptyStatement();
            case "{": return this.BlockStatement();
            default: return this.ExpressionStatement();
        }
    }

    /**
     * EmptyStatement
     * : ";"
     * ;
     */
    EmptyStatement(){
        this._eat(';');
        return {
            type: "EmptyStatement",
        }
    }

    /**
     * BlockStatement
     * : "{" OptStatementList "}"
     * ;
     */
    BlockStatement(){
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
        this._eat('}');

        return {
            type: "BlockStatement",
            body: body,
        }
    }

    ExpressionStatement(){
        const expresion = this.Expression();
        this._eat(';');
        return {
            type: "ExpressionStatement",
            expression: expresion,
        }
    }


    /**
     * Expression
     * : Literal
     * ; 
     */
    Expression(){
        return this.AssignmentExpression();
    }


     /**
     * AssignmentExpression
     * : AdditiveExpression
     * | LeftHandSideExpression AssignmentOperator AssignmentExpression
     * ;
     */
    AssignmentExpression(){
        const left = this.AdditiveExpression();

        if (!this._isAssignmentOperator(this._lookahead.type)){
            return left;
        }

        return {
            type: "AssignmentExpression",
            operator: this.AssignmentOperator().value,
            left: this._checkValidAssignmentTarget(left),
            right: this.AssignmentExpression()
        }
    } 

    /**
     * LeftHandSideExpression
     *  : Identifier
     *  ;
     */
    LeftHandSideExpression(){
        return this.Identifier();
    }

    /**
     * Identifer
     *  : IDENTIFIER
     *  ; 
     */
    Identifier(){
        const name = this._eat('IDENTIFIER').value;
        return {
            type: 'Identifier',
            name,
        }
    }

    /**
     * Extra check for valid assignment target
     */
    _checkValidAssignmentTarget(node){
        if (node.type === 'Identifier'){
            return node;
        }

        throw new SyntaxError('Invalid left-hand side assignment expression');
    }

    /**
     * Checks whether the token is an assignment operator
     */
    _isAssignmentOperator(tokenType){
        return tokenType === "SIMPLE_ASSIGN" || tokenType === 'COMPEX_ASSIGN';
    }

    /**
     * AssignmentOperator
     *  : SIMPLE_ASSIGN
     *  | COMPLEX_ASSIGN
     *  ;
     */
    AssignmentOperator(){
        if (this._lookahead.type === 'SIMPLE_ASSIGN') {
            return this._eat('SIMPLE_ASSIGN');
        }
        return this._eat('COMPLEX_ASSIGN');
    }

    /**
     * AdditiveExpression
     *  : MultiplicativeExpression
     * | AdditiveExpression ADDITIVE_OPERATOR Literal
     * ;
     */
    AdditiveExpression(){
        let left = this.MultiplicativeExpression();

        while (this._lookahead.type === 'ADDITIVE_OPERATOR'){
            // operator: +, -

            const operator = this._eat('ADDITIVE_OPERATOR');
            const right = this.MultiplicativeExpression();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right,
            }
        }

        return left;
    }

     /**
     * MULTIPLICATIVE Expression
     *  : MultiplicativeExpression
     * | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression -> PrimaryExpression MULTIPLICATIVE_OPERATOR
     * ;
     */
     MultiplicativeExpression(){
        let left = this.PrimaryExpression();

        while (this._lookahead.type === 'MULTIPLICATIVE_OPERATOR'){
            // operator: *, /

            const operator = this._eat('MULTIPLICATIVE_OPERATOR');
            const right = this.PrimaryExpression();

            left = {
                type: "BinaryExpression",
                operator: operator.value,
                left: left,
                right: right,
            }
        }

        return left;
    }

   
    /**
     * PrimaryExpression
     *      Literal
     *      | ParenthesizedExpression
     */
    PrimaryExpression(){
        if (this._isLiteral(this._lookahead.type)){
            return this.Literal();
        }

        switch (this._lookahead.type){
            case "(":
                return this.ParenthesizedExpression();
            default:
                return this.LeftHandSideExpression();
        }
    }

    /**
     * Whether the token is a literal
     */
    _isLiteral(tokenType){
        return tokenType === 'NUMBER' || tokenType === 'STRING';
    }

    /**
     * ParenthesizedExpression
     *  : '(' Expression ')'
     *  ;
     */
    ParenthesizedExpression(){
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
    }


    /**
     * Literal
     *  : NumericLiteral
     *  | StringLiteral
     *  ;
     * 
     */

    Literal() {
        switch (this._lookahead.type){
            case "NUMBER": return this.NumericLiteral();
            case "STRING": return this.StringLiteral();
        }
        throw new SyntaxError(
            `Literal: unexpected literal production`
        )
    }

    /**
     * NumericLiteral
     *   : NUMBER
     *   ;
     */
    NumericLiteral(){
        const token = this._eat('NUMBER');
        return {
            type: "NumericLiteral",
            value: Number(token.value),
        }
    }

    /*
    * StringLiteral
    *   : STRING
    *   ;
    */
   StringLiteral(){
        const token = this._eat('STRING');
        return {
            type: "StringLiteral",
            value: token.value.slice(1, -1), // strip the quotes on either end
        }
   }

    /**
     * Consumes the current token and advances the tokenizer
     * to the next token
     * 
     * Expects a toke of a given type
     */
    _eat(tokenType){
        const token = this._lookahead;

        if (token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: "${tokenType}"`
            )
        }

        if (token.type !== tokenType){
            console.log(`Types: ${token.type} ${tokenType}`)
            throw new SyntaxError(
                `Unexpected token: "${token.type}", expected: "${tokenType}"`
            )
        }

        // Advance tokenizer to the next token
        this._lookahead = this._tokenizer.getNextToken();
        return token;
    }
}

module.exports = {
    Parser,
}