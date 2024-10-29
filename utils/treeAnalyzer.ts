import { readFileSync } from 'fs';

interface TreeNode {
  [key: string]: TreeNode;
}

export function loadHierarchy(filePath: string): TreeNode {
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as TreeNode;
}

export function findWordsAtDepth(
  tree: TreeNode,
  depth: number,
  currentDepth: number = 0
): string[] {
  if (currentDepth === depth) {
    // @ts-ignore
    return Object.keys(tree).flatMap(key =>
      // @ts-ignore
      Array.isArray(tree[key]) ? tree[key] : [key]
    );
  }

  return Object.values(tree)
    .filter(node => typeof node === 'object')
    .flatMap(subtree =>
      findWordsAtDepth(subtree as TreeNode, depth, currentDepth + 1)
    );
}

export function getTreeAtDepth(tree: TreeNode , depth:number): TreeNode{
  let oldTree:TreeNode = tree
  let newTree:TreeNode = {}
  while (depth > 1 && Object.keys(oldTree).length>0 ){
    newTree = {}
    // Create a new Tree with all the subchild nodes as its children
    Object.values(oldTree).forEach((subtree)=>Object.assign(newTree,subtree))
    oldTree = newTree
    // console.log("newTree: ", newTree)
    depth -= 1
  }
  return newTree
}

export function getAllKeysFromObject(obj:any):string[] {
  let keys:string[] = [];

  for (const key in obj) {
    keys.push(key); // Add the current key

    // If the value is an object, get its keys recursively
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeysFromObject(obj[key]));
    }
  }

  return keys;
}

export function countWordsInKeys(
  phraseWordCount: Record<string, number>,
  tree: Record<string, Record<string, any>>
): Record<string, number> {
  const result: Record<string, number> = {};

  // Helper function to recursively search each subtree
  function countInSubtree(node: Record<string, any>, wordCounts: Record<string, number>): number {
      let count = 0;

      for (const key in node) {
          // If the key matches any word in phraseWordCount, add its count
          if (wordCounts[key.toLowerCase()]) {
              count += wordCounts[key.toLowerCase()];
          }

          // Continue counting within nested objects
          if (typeof node[key] === "object" && node[key] !== null) {
              count += countInSubtree(node[key], wordCounts);
          }
      }

      return count;
  }

  // Iterate over each direct child in tree
  for (const childKey in tree) {
    const subCount = countInSubtree(tree[childKey], phraseWordCount);
    if (subCount>0){
      result[childKey] = subCount
    }
  }
  // console.log("result: ",result)
  return result;
}
