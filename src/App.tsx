import React, { useState, useEffect } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Upload, Search, FileX, FileDown, Plus, Minus } from 'lucide-react'
import { toast } from "./components/ui/toast"
import { ToastAction } from "./components/ui/toast"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { extractDataFromImage } from './utils/imageProcessing'

// ... (rest of the code remains the same)

export default function InventoryManager() {
  // ... (existing code)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setIsLoading(true)
      try {
        for (let i = 0; i < files.length; i++) {
          const extractedData = await extractDataFromImage(files[i])
          setInventory(prev => {
            const newInventory = [...prev]
            extractedData.forEach(item => {
              const existingItemIndex = newInventory.findIndex(i => i.code === item.code)
              if (existingItemIndex !== -1) {
                newInventory[existingItemIndex] = {
                  ...newInventory[existingItemIndex],
                  stock: (parseInt(newInventory[existingItemIndex].stock) + parseInt(item.stock)).toString(),
                  stockValorE: (parseFloat(newInventory[existingItemIndex].stockValorE) + parseFloat(item.stockValorE)).toFixed(2)
                }
              } else {
                newInventory.push(item)
              }
            })
            return newInventory
          })
        }
        toast({
          title: "Éxito",
          description: "Datos extraídos correctamente de las imágenes.",
        })
      } catch (error) {
        console.error('Failed to extract data from images:', error)
        toast({
          title: "Error",
          description: "No se pudieron extraer los datos de una o más imágenes.",
          variant: "destructive",
          action: <ToastAction altText="Intentar de nuevo">Intentar de nuevo</ToastAction>,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  // ... (rest of the code remains the same)
}