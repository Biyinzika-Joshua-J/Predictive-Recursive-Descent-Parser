/**
 * Tokenizer spec
 */
const TokenSpec = [

    // Whitespace
    [/^\s+/, null],

    // Comments
    [/^\/\/.*/, null],

     // Symbols, delimiters
     [/^;/, ';'],
     [/^\{/, '{'],
     [/^\}/, '}'],


    [/^\/\*[\s\S]*?\*\//, null],

    // Numbers
    [/^\d+/, "NUMBER"],

    // Strings
    [/^"[^"]*"/, "STRING"],
    [/^'[^']*'/, "STRING"],
]

/**
 * Lazily pulls a token from a stream
 */

class Tokenizer {

    /**
     * Initializes the string
     */
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    /*
        Whether the tokenizer reached the end of the file.
    */
    isEOF(){
        return this._cursor === this._string.length;
    }


    /**
     * Whether we still have more tokens
     */
    hasMoreTokens(){
        return this._cursor < this._string.length;
    }

    /**
     * Obtains next token
     */
    getNextToken(){
        if (!this.hasMoreTokens()){
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regExp, tokenType] of TokenSpec){
            const tokenValue = this._match(regExp, string);

            if (tokenValue == null){
                continue;
            }

            // Should skip next token eg whitespace
            if (tokenType == null){
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue,
            }
        }

        return null;

    }

    /**
     * Matches a token for a regular expression 
     */
    _match(regExp, string){
        let matched = regExp.exec(string);
        
        if (matched == null){
            return null
        }

        this._cursor += matched[0].length;
        return matched[0];
    }

    

}

module.exports = {
    Tokenizer,
}