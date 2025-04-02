module.exports = test => {
    // empty statement
    test(`;`, {
        "type": "Program",
        "body": [
          {
            "type": "EmptyStatement"
          }
        ]
      })
}
