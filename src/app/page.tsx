'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { PlusCircle, Trash2, ChevronRight, ChevronDown, Save } from 'lucide-react'

type TreeNode = {
  id: string
  key: string
  children: TreeNode[]
}

const TreeNodeComponent = ({ node, onAddChild, onRemove, onUpdateKey, level = 0 }: {
  node: TreeNode
  onAddChild: (parentId: string) => void
  onRemove: (id: string) => void
  onUpdateKey: (id: string, newKey: string) => void
  level?: number
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="ml-4">
      <div className="flex items-center space-x-2">
        {node.children.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        )}
        {level === 0 ? (
          <span>Root:</span>
        ) : (
          <Input
            className="w-40"
            value={node.key}
            onChange={(e) => onUpdateKey(node.id, e.target.value)}
          />
        )}
        <Button variant="ghost" size="icon" className="w-6 h-6 p-0" onClick={() => onAddChild(node.id)}>
          <PlusCircle className="w-4 h-4" />
        </Button>
        {level > 0 && (
          <Button variant="ghost" size="icon" className="w-6 h-6 p-0" onClick={() => onRemove(node.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      {isExpanded && node.children.length > 0 && (
        <div className="ml-4">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              onAddChild={onAddChild}
              onRemove={onRemove}
              onUpdateKey={onUpdateKey}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Component() {
  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    key: 'Root',
    children: []
  })
  const [fileName, setFileName] = useState('custom.json')
  const { toast } = useToast()

  const addChild = (parentId: string) => {
    const newNode: TreeNode = {
      id: uuidv4(),
      key: 'newKey',
      children: []
    }

    const updateTree = (node: TreeNode): TreeNode => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode] }
      }
      return { ...node, children: node.children.map(updateTree) }
    }

    setTree(updateTree(tree))
  }

  const removeNode = (id: string) => {
    const updateTree = (node: TreeNode): TreeNode => {
      return {
        ...node,
        children: node.children.filter(child => child.id !== id).map(updateTree)
      }
    }
    setTree(updateTree(tree))
  }

  const updateKey = (id: string, newKey: string) => {
    const updateTree = (node: TreeNode): TreeNode => {
      if (node.id === id) {
        return { ...node, key: newKey }
      }
      return { ...node, children: node.children.map(updateTree) }
    }
    setTree(updateTree(tree))
  }

  const treeToJson = (node: TreeNode): Record<string, any> => {
    const obj: Record<string, any> = {}
    node.children.forEach(child => {
      obj[child.key] = treeToJson(child)
    })
    return obj
  }

  const saveJson = () => {
    try {
      const json = JSON.stringify(treeToJson(tree), null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: `File "${a.download}" has been saved successfully.`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the file.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JSON Tree Creator</h1>
      <div className="bg-neutral-100 p-4 rounded-lg mb-4">
        <TreeNodeComponent
          node={tree}
          onAddChild={addChild}
          onRemove={removeNode}
          onUpdateKey={updateKey}
        />
      </div>
      <div className="flex justify-between space-x-4 items-center mb-4">
        <div className='flex'>
          <span className='my-auto'>File name:</span>
          <Input
            placeholder="Enter file name..."
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="ml-3 w-64"
          />
        </div>
        
        <Button onClick={saveJson}>
          <Save className="w-4 h-4 mr-2" />
          Save JSON
        </Button>
      </div>
    </div>
  )
}