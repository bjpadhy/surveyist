module.exports = {
	"env": {
		"node": true,
		"commonjs": true,
		"es2020": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 11
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	},
	"overrides": [
		{
			"files": ["*.html", "*.css"],
			"rules": {
				"no-unused-expressions": "off"
			}
		}
	]
};
