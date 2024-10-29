import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const runCLI = async (command: string) => {
  const { stdout, stderr } = await execAsync(`bun run cli.ts ${command}`);
  if (stderr) throw new Error(stderr);
  return stdout.trim();
};

describe("CLI Tests", () => {
  // Exemplo 1: Um termo correspondente e com verbose ativado
  test("Exemplo 1: profundidade 2 com um termo correspondente e verbose", async () => {
    const output = await runCLI('analyze -d 2 "Eu amo papagaios" -v');
    expect(output).toContain("Aves = 1");
    expect(output).toContain("Tempo de carregamento dos parâmetros");
    expect(output).toContain("Tempo de verificação da frase");
  });

  // Exemplo 2: Dois termos correspondentes
  test("Exemplo 2: profundidade 3 com dois termos correspondentes", async () => {
    const output = await runCLI('analyze -d 3 "Eu vi gorilas e papagaios"');
    expect(output).toContain("Pássaros = 1");
    expect(output).toContain("Primatas = 1");
  });

  // Exemplo 3: Sem correspondência
  test("Exemplo 3: profundidade 5 sem termos correspondentes", async () => {
    const output = await runCLI('analyze -d 5 "Eu tenho preferência por animais carnívoros"');
    expect(output).toBe("0;");
  });

  // Exemplo 4: Teste com uma frase longa (>5000 caracteres)
  test("Exemplo 4: frase longa com pelo menos 5000 caracteres e termos espalhados", async () => {
    const longPhrase = "Eu vi papagaios ".repeat(500) + " e águias no zoológico"; // Frase de 5000+ caracteres
    const output = await runCLI(`analyze -d 3 "${longPhrase}"`);

    expect(output).toContain("Pássaros = 500");
    expect(output).toContain("Rapinas = 1");
  });
});
