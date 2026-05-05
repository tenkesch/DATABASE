class Osoba {
	constructor(ime, pol) {
		;((this.ime = ime), (this.pol = pol))
	}
}

class Student {
	constructor(a, b, c = 0.0) {
		this.ime = a
		this.pol = b
		this.prosek = c
	}

	displayStats() {
		console.log(this.prosek)
	}
}

const sofia = new Student('Sofia', 0, 9.67)
const luka = new Student('Tenki', 1, 10.0)

console.log(sofia.prosek)
console.log(luka.prosek)

// const niz = ['Sofia', 0, 9.67]
