import { parse } from "https://deno.land/std@0.86.0/flags/mod.ts";

const args = parse(Deno.args);

/** Number of sides the dice has. */
const d: number = args.d ?? 6;
/** Number of simulations. */
const n: number = args.n ?? 100;
/** Max. percentage deviation at which the simulations stop. */
const p: number = args.p ?? 5;
/** Quiet output. */
const q: boolean = args.q ?? false;

const requiredThrows: number[] = [];

for (let i = 0; i < n; i++)
{
	let throws: Record<number, number> = {};
	for (let x = 1; x <= d; x++)
		throws[x] = 0;

	let throwNumber = 0;
	const limit = 1_000_000;
	while (throwNumber < limit)
	{
		const value = Math.ceil(Math.random() * d);
		throws[value]++;
		throwNumber++;

		let fair = true;
		for (let x = 1; x <= d; x++)
		{
			const actual = throws[x] / throwNumber;
			const theoretical = 1 / d;
			const deviation = Math.abs(theoretical - actual)
			const maxDeviation = theoretical * (p / 100);

			if (deviation > maxDeviation)
			{
				fair = false;
				break;
			}
		}

		if (fair)
			break;
	}

	if (q == false)
	{
		if (throwNumber == limit)
		{
			console.warn(`Throw limit reached (${limit}).`);
		}
	
		console.log('Throws:', throws);
		console.log('Total #:', throwNumber);
	}

	requiredThrows.push(throwNumber);
}

const average = requiredThrows.reduce((a, b) => a + b, 0) / requiredThrows.length;
if (q == false) console.log('---')
console.log(`${d}-sided die`);
console.log(`Number of simulations: ${n}`);
console.log(`Average number of throws to be within ${p}%: ${average}`);
console.log(`Max: ${Math.max(...requiredThrows)} | Min: ${Math.min(...requiredThrows)}`);
