import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { UserCog, Plus, Pencil, Trash2, Phone, Stethoscope } from 'lucide-react';
import { Profesional, Especialidad, EstadoProfesional } from '@/types';
import * as api from '@/services/api';
import { toast } from 'sonner';

export const ProfesionalesManager = () => {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: Especialidad.MEDICINA_GENERAL,
    telefono: '',
    estado: EstadoProfesional.ACTIVO
  });

  useEffect(() => {
    loadProfesionales();
  }, []);

  const loadProfesionales = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProfesionales();
      setProfesionales(data);
    } catch (error) {
      toast.error('Error al cargar los profesionales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (profesional?: Profesional) => {
    if (profesional) {
      setEditingProfesional(profesional);
      setFormData({
        nombre: profesional.nombre,
        especialidad: profesional.especialidad,
        telefono: profesional.telefono,
        estado: profesional.estado
      });
    } else {
      setEditingProfesional(null);
      setFormData({
        nombre: '',
        especialidad: Especialidad.MEDICINA_GENERAL,
        telefono: '',
        estado: EstadoProfesional.ACTIVO
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProfesional) {
        await api.updateProfesional(editingProfesional.id, formData);
        toast.success('Profesional actualizado correctamente');
      } else {
        await api.createProfesional(formData);
        toast.success('Profesional creado correctamente');
      }

      setIsDialogOpen(false);
      loadProfesionales();
    } catch (error) {
      toast.error('Error al guardar el profesional');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este profesional? Esta acción no se puede deshacer.')) {
      try {
        await api.deleteProfesional(id);
        toast.success('Profesional eliminado correctamente');
        loadProfesionales();
      } catch (error) {
        toast.error('Error al eliminar el profesional');
      }
    }
  };

  const getEstadoBadge = (estado: EstadoProfesional) => {
    const variants: Record<EstadoProfesional, { variant: any; label: string }> = {
      [EstadoProfesional.ACTIVO]: { variant: 'default', label: 'Activo' },
      [EstadoProfesional.INACTIVO]: { variant: 'secondary', label: 'Inactivo' },
      [EstadoProfesional.VACACIONES]: { variant: 'outline', label: 'Vacaciones' }
    };
    const config = variants[estado];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="w-5 h-5" />
                Gestión de Profesionales
              </CardTitle>
              <CardDescription>
                Administra los médicos y especialistas del sistema
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Profesional
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingProfesional ? 'Editar Profesional' : 'Nuevo Profesional'}</DialogTitle>
                  <DialogDescription>
                    {editingProfesional ? 'Modifica los datos del profesional' : 'Completa el formulario para registrar un nuevo profesional'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Dr. Juan Pérez"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Select 
                      value={formData.especialidad} 
                      onValueChange={(value: Especialidad) => setFormData({ ...formData, especialidad: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Especialidad.MEDICINA_GENERAL}>Medicina General</SelectItem>
                        <SelectItem value={Especialidad.CARDIOLOGIA}>Cardiología</SelectItem>
                        <SelectItem value={Especialidad.PEDIATRIA}>Pediatría</SelectItem>
                        <SelectItem value={Especialidad.GINECOLOGIA}>Ginecología</SelectItem>
                        <SelectItem value={Especialidad.TRAUMATOLOGIA}>Traumatología</SelectItem>
                        <SelectItem value={Especialidad.DERMATOLOGIA}>Dermatología</SelectItem>
                        <SelectItem value={Especialidad.OFTALMOLOGIA}>Oftalmología</SelectItem>
                        <SelectItem value={Especialidad.PSIQUIATRIA}>Psiquiatría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="555-0000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={formData.estado} 
                      onValueChange={(value: EstadoProfesional) => setFormData({ ...formData, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EstadoProfesional.ACTIVO}>Activo</SelectItem>
                        <SelectItem value={EstadoProfesional.INACTIVO}>Inactivo</SelectItem>
                        <SelectItem value={EstadoProfesional.VACACIONES}>Vacaciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingProfesional ? 'Actualizar' : 'Crear'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profesionales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No hay profesionales registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  profesionales.map((profesional) => (
                    <TableRow key={profesional.id}>
                      <TableCell>{profesional.id}</TableCell>
                      <TableCell className="font-medium">{profesional.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-blue-500" />
                          <span className="capitalize">{profesional.especialidad.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {profesional.telefono}
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(profesional.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(profesional)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(profesional.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
