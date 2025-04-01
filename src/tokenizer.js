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
        return this._cursor > this._string.length;
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

        // Numbers
        if (!Number.isNaN(Number(string[0]))) {
            let number = '';
            while (!Number.isNaN(String(string[this._cursor])) && this._cursor < this._string.length) {
                number += string[this._cursor];
                this._cursor++;
            }
            return {
                type: "NUMBER",
                value: number,
            }
        }

        // Strings
        if (string[0] === '"'){
            let s = '';

            do {
                s += string[this._cursor++];
            } while (string[this._cursor] !== '"' && !this.isEOF());

            s += this._cursor++; // skip the closing "
            
            return {
                type: "STRING",
                value: s,
            }
        }

        return null;

    }

    

}

module.exports = {
    Tokenizer,
}