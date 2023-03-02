function getQueryChecks(checks, nameTable) {
	let queryExtra = "";
	if (checks) {
		Object.keys(checks).forEach((division) => {
			if (checks[division]) {
				if (queryExtra === "") {
					queryExtra += ` ${nameTable}.id = ${[division]} `;
				} else {
					queryExtra += `OR ${nameTable}.id = ${[division]} `;
				}
			}
		});
	}
	if (queryExtra !== "") {
		queryExtra = " AND (" + queryExtra + ") ";
	}
	return queryExtra;
}
function getQueryChecksCant(checks, nameTable) {
	let queryExtra = "";
	Object.keys(checks).forEach((division) => {
		if (checks[division]) {
			if (queryExtra === "") {
				queryExtra += ` ${nameTable} = ${[division]} `;
			} else {
				queryExtra += `OR ${nameTable} = ${[division]} `;
			}
		}
	});
	if (queryExtra !== "") {
		queryExtra = " (" + queryExtra + ") ";
	}
	return queryExtra;
}

exports.getQueryChecks = getQueryChecks;
exports.getQueryChecksCant = getQueryChecksCant;
