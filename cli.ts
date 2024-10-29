import { Command } from "commander";
import { performance } from "perf_hooks";
import { loadHierarchy, getTreeAtDepth, countWordsInKeys } from "./utils/treeAnalyzer";

const program = new Command();

program
  .name('JSON Hierarchy Manager')
  .description('CLI to analyse JSON trees')
  .version('0.1.0');

program
  .command("analyze")
  .description("Analisa a frase fornecida e exibe os itens no nível de profundidade especificado.")
  .argument("<phrase>", "Frase a ser analisada")
  .option("-d, --depth <n>", "Nível de profundidade da árvore", parseInt)
  .option("-v, --verbose", "Exibe informações detalhadas de desempenho")
  .action(async (phrase:string, options:any) => {
    const startLoad = performance.now();
    const hierarchy = loadHierarchy('./dicts/hierarchy.json');
    const loadTime = performance.now() - startLoad;

    const startAnalyze = performance.now();
    // Obtain the version of the tree at the given depth 
    const treeAtDepth = getTreeAtDepth(hierarchy,options.depth)
    // Separate phrase into array of words and count the amount of times each word appears.
    const phraseWordCount: Record<string, number> = phrase.toLowerCase().trim().split(/\s+/).reduce((acc: Record<string, number>, str: string) => {
      acc[str] = (acc[str] || 0) + 1;
      return acc;
    }, {});
    const finalResult = countWordsInKeys(phraseWordCount,treeAtDepth)
    const analyzeTime = performance.now() - startAnalyze;

    if (Object.keys(finalResult).length === 0) {
      console.log('0;');
      // console.log(`Na frase não existe nenhum filho do nível ${options.depth} e nem o nível ${options.depth} possui os termos especificados.`);
    } else {
      Object.entries(finalResult).forEach(([key, count]) => {
        if (count>0){
          console.log(`${key} = ${count};`);
        }
      });
    }

    if (options.verbose) {
      console.log(`Tempo de carregamento dos parâmetros: ${loadTime.toFixed(2)}ms`);
      console.log(`Tempo de verificação da frase: ${analyzeTime.toFixed(2)}ms`);
    }
  });

program.parse(process.argv);
