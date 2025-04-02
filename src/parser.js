
const {Tokenizer} = require('./tokenizer');


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
            body: this.Literal()
        };
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