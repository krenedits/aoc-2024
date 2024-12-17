import { getData } from '../common';

const REGISTERS = ['A', 'B', 'C'] as const;
type Register = (typeof REGISTERS)[number];
type Registers = Record<Register, bigint>;
type Program = number[];

const INITIAL_REGISTERS: Registers = Object.fromEntries(REGISTERS.map((r) => [r, 0n])) as Registers;

const parseData = (): { program: Program; registers: Registers } => {
    const data = getData('input.txt');
    const [rawRegisters, rawProgram] = data.split('\n\n');

    const registers = { ...INITIAL_REGISTERS };
    rawRegisters.split('\n').forEach((line) => {
        const [, register, value] = /Register (A|B|C): (\d+)/.exec(line) || [];
        if (register) registers[register as Register] = BigInt(value);
    });

    const program = Array.from(rawProgram.matchAll(/\d+/g), (match) => +match[0]);

    return { program, registers };
};

type Instruction = (operand: number) => void;

const INSTRUCTION_NAMES = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv'] as const;
type InstructionName = (typeof INSTRUCTION_NAMES)[number];

class Computer {
    private readonly registers: Registers;
    private instructionPointer = 0;
    private readonly result: bigint[] = [];

    constructor(registers: Registers) {
        this.registers = { ...registers }; // Clone for isolation
    }

    private getComboOperand(operand: number): bigint {
        const operandMap = [0n, 1n, 2n, 3n, this.registers.A, this.registers.B, this.registers.C];
        if (operand < operandMap.length) return operandMap[operand];
        throw new Error(`Unknown operand: ${operand}`);
    }

    private advancePointer() {
        this.instructionPointer += 2;
    }

    private readonly instructions: Record<InstructionName, Instruction> = {
        adv: (operand) => {
            this.registers.A = BigInt(
                ('' + this.registers.A / 2n ** this.getComboOperand(operand)).replace('.', ''),
            );
            this.advancePointer();
        },
        bxl: (operand) => {
            this.registers.B ^= BigInt(operand);
            this.advancePointer();
        },
        bst: (operand) => {
            this.registers.B = this.getComboOperand(operand) % 8n;
            this.advancePointer();
        },
        jnz: (operand) => {
            if (this.registers.A !== 0n) {
                this.instructionPointer = operand;
            } else {
                this.advancePointer();
            }
        },
        bxc: () => {
            this.registers.B ^= this.registers.C;
            this.advancePointer();
        },
        out: (operand) => {
            this.result.push(this.getComboOperand(operand) % 8n);
            this.advancePointer();
        },
        bdv: (operand) => {
            this.registers.B = BigInt(
                ('' + this.registers.A / 2n ** this.getComboOperand(operand)).replace('.', ''),
            );
            this.advancePointer();
        },
        cdv: (operand) => {
            this.registers.C = BigInt(
                ('' + this.registers.A / 2n ** this.getComboOperand(operand)).replace('.', ''),
            );
            this.advancePointer();
        },
    };

    run(program: Program): bigint[] {
        while (this.instructionPointer < program.length) {
            const [instructionIdx, operand] = program.slice(
                this.instructionPointer,
                this.instructionPointer + 2,
            );
            const instructionName = INSTRUCTION_NAMES[instructionIdx];
            if (!instructionName) throw new Error(`Invalid instruction index: ${instructionIdx}`);
            this.instructions[instructionName](operand);
        }
        return this.result;
    }
}

const { registers, program } = parseData();

const solve2 = (): bigint => {
    const goal = program.join(',');
    let A = 0n;

    while (true) {
        A++;
        const result = new Computer({ A, B: 0n, C: 0n }).run(program).join(',');
        if (result === goal) return A;
        if (goal.endsWith(result)) A = A * 8n - 1n;
    }
};

console.time('time');
const computer = new Computer(registers);
const result1 = computer.run(program).join(',');
const result2 = solve2();
console.timeEnd('time');

console.log(result1, result2);
