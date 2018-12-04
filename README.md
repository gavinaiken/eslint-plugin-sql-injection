# eslint-plugin-sql-injection

ESLint plugin that checks for string concatenation in SQL queries. By default it looks for any function calls where the function name is `query`, or you can override that with the options. See the [examples directory](https://github.com/gavinaiken/eslint-plugin-sql-injection/tree/master/test/examples) for valid and invalid samples for the rule.

# Installation

```
npm install eslint-plugin-sql-injection
```

# Rules

- `no-sql-injection` - Prevent using string concatenation in SQL queries

# Options

- `queryFunctionNames` controls what function names to inspect

# Configuration

Add a `plugins` section and specify `sql-injection` as a plugin:

```json
{
  "plugins": [
    "sql-injection"
  ]
}
```

Enable the rule:

```json
{
  "rules": {
    "sql-injection/no-sql-injection": "error"
  }
}
```

Or with options:

```json
{
  "rules": {
    "sql-injection/no-sql-injection": [ "error", { "queryFunctionNames": [ "q" ] } ]
  }
}
```

# License

eslint-plugin-sql-injection is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
