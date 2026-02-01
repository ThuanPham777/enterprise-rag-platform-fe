/**
 * Upload Document Dialog Component
 * Handles document upload with file selection and access rules configuration
 */

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { uploadsService } from '@/services'
import { useRoles, useDepartments, usePositions, useCreateDocument } from '@/hooks'
import { FileType } from '@/types'

interface UploadDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UploadDocumentDialog({ open, onOpenChange }: UploadDocumentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])

  const { data: roles } = useRoles()
  const { data: departments } = useDepartments()
  const { data: positions } = usePositions()
  const createDocument = useCreateDocument()

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-fill title from filename (without extension)
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
        setTitle(nameWithoutExt)
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
        setTitle(nameWithoutExt)
      }
    }
  }

  // Get file type from file extension
  const getFileType = (fileName: string): FileType => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const fileTypeMap: Record<string, FileType> = {
      pdf: FileType.PDF,
      doc: FileType.DOC,
      docx: FileType.DOCX,
      txt: FileType.TXT,
      xlsx: FileType.XLSX,
      xls: FileType.XLS,
      csv: FileType.CSV,
      json: FileType.JSON,
      xml: FileType.XML,
      html: FileType.HTML,
      png: FileType.PNG,
      jpg: FileType.JPG,
      jpeg: FileType.JPEG,
      gif: FileType.GIF,
    }
    return fileTypeMap[extension || ''] || FileType.TXT
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Toggle role selection
  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    )
  }

  // Toggle department selection
  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    )
  }

  // Toggle position selection
  const togglePosition = (posId: string) => {
    setSelectedPositions(prev =>
      prev.includes(posId) ? prev.filter(id => id !== posId) : [...prev, posId]
    )
  }

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a document title')
      return
    }

    // Validate access rules - at least one required
    if (
      selectedRoles.length === 0 &&
      selectedDepartments.length === 0 &&
      selectedPositions.length === 0
    ) {
      toast.error('Please select at least one access rule (role, department, or position)')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(10)

      // 1. Upload file to S3
      const filePath = await uploadsService.uploadFile(selectedFile)
      setUploadProgress(60)

      // 2. Create document in database
      const fileType = getFileType(selectedFile.name)
      await createDocument.mutateAsync({
        title: title.trim(),
        filePath,
        fileType,
        accessRules: {
          roles: selectedRoles.length > 0 ? selectedRoles : undefined,
          departments: selectedDepartments.length > 0 ? selectedDepartments : undefined,
          positions: selectedPositions.length > 0 ? selectedPositions : undefined,
        },
      })
      setUploadProgress(100)

      toast.success('Document uploaded successfully and is being processed')
      handleClose()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload document')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Reset form and close
  const handleClose = () => {
    setSelectedFile(null)
    setTitle('')
    setSelectedRoles([])
    setSelectedDepartments([])
    setSelectedPositions([])
    setUploadProgress(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={uploading ? undefined : onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to your knowledge base. Configure who can access it.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>Document File *</Label>
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, TXT, XLSX, CSV, JSON, XML, HTML, MARKDOWN, Images
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,.json,.xml,.html,.png,.jpg,.jpeg,.gif"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Document Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* Access Rules Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-base">Access Rules *</Label>
                <Badge variant="outline" className="text-xs">
                  At least one required
                </Badge>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <Label className="text-sm font-normal">Roles</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {roles?.map(role => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={() => toggleRole(role.id)}
                        disabled={uploading}
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {role.name}
                      </label>
                    </div>
                  ))}
                  {!roles || roles.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No roles available</p>
                  ) : null}
                </div>
              </div>

              {/* Departments */}
              <div className="space-y-2">
                <Label className="text-sm font-normal">Departments</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {departments?.map(dept => (
                    <div key={dept.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept.id}`}
                        checked={selectedDepartments.includes(dept.id)}
                        onCheckedChange={() => toggleDepartment(dept.id)}
                        disabled={uploading}
                      />
                      <label
                        htmlFor={`dept-${dept.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {dept.name}
                      </label>
                    </div>
                  ))}
                  {!departments || departments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No departments available</p>
                  ) : null}
                </div>
              </div>

              {/* Positions */}
              <div className="space-y-2">
                <Label className="text-sm font-normal">Positions</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {positions?.map(pos => (
                    <div key={pos.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pos-${pos.id}`}
                        checked={selectedPositions.includes(pos.id)}
                        onCheckedChange={() => togglePosition(pos.id)}
                        disabled={uploading}
                      />
                      <label
                        htmlFor={`pos-${pos.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {pos.name} (Level {pos.level})
                      </label>
                    </div>
                  ))}
                  {!positions || positions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No positions available</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !selectedFile || !title.trim()}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
