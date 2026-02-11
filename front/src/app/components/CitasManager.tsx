import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, Clock, Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { Cita, EstadoCita } from '@/types';
import * as api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const CitasManager = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Form state
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    estado: EstadoCita.PENDIENTE,
    profesionalId: '',
    usuarioId: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [citasData, profesionalesData, usuariosData] = await Promise.all([
        user?.role === 'admin' ? api.getCitas() : api.getCitasByUsuario(user!.id),
        api.getProfesionales(),
        user?.role === 'admin' ? api.getUsuarios() : Promise.resolve([])
      ]);
      setCitas(citasData);
      setProfesionales(profesionalesData.filter(p => p.estado === 'activo'));
      setUsuarios(usuariosData);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (cita?: Cita) => {
    if (cita) {
      setEditingCita(cita);
      setFormData({
        fecha: cita.fecha,
        hora: cita.hora,
        estado: cita.estado,
        profesionalId: cita.profesionalId.toString(),
        usuarioId: cita.usuarioId.toString()
      });
    } else {
      setEditingCita(null);
      // Asignar automáticamente el usuario autenticado cuando no es admin
      const defaultUsuarioId = user?.role === 'usuario' ? user.id.toString() : '';
      // Usuario normal inicia con estado "Confirmada", admin con "Pendiente"
      const defaultEstado = user?.role === 'usuario' ? EstadoCita.CONFIRMADA : EstadoCita.PENDIENTE;
      setFormData({
        fecha: '',
        hora: '',
        estado: defaultEstado,
        profesionalId: '',
        usuarioId: defaultUsuarioId
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Si es usuario normal, forzar que la cita sea para sí mismo
      const usuarioIdFinal = user?.role === 'usuario' ? user.id : parseInt(formData.usuarioId);
      
      const citaData = {
        fecha: formData.fecha,
        hora: formData.hora,
        estado: formData.estado,
        profesionalId: parseInt(formData.profesionalId),
        usuarioId: usuarioIdFinal
      };

      if (editingCita) {
        await api.updateCita(editingCita.id, citaData);
        toast.success('Cita actualizada correctamente');
      } else {
        await api.createCita(citaData);
        toast.success('Cita creada correctamente');
      }

      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error('Error al guardar la cita');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      try {
        await api.deleteCita(id);
        toast.success('Cita eliminada correctamente');
        loadData();
      } catch (error) {
        toast.error('Error al eliminar la cita');
      }
    }
  };

  const getEstadoBadge = (estado: EstadoCita) => {
    const variants: Record<EstadoCita, { variant: any; label: string }> = {
      [EstadoCita.PENDIENTE]: { variant: 'secondary', label: 'Pendiente' },
      [EstadoCita.CONFIRMADA]: { variant: 'default', label: 'Confirmada' },
      [EstadoCita.CANCELADA]: { variant: 'destructive', label: 'Cancelada' },
      [EstadoCita.COMPLETADA]: { variant: 'outline', label: 'Completada' }
    };
    const config = variants[estado];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const citasFiltradas = filtroEstado === 'todos' 
    ? citas 
    : citas.filter(c => c.estado === filtroEstado);

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
                <Calendar className="w-5 h-5" />
                Gestión de Citas
              </CardTitle>
              <CardDescription>
                {user?.role === 'admin' ? 'Administra todas las citas del sistema' : 'Gestiona tus citas médicas'}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cita
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCita ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
                  <DialogDescription>
                    {editingCita ? 'Modifica los datos de la cita' : 'Completa el formulario para agendar una nueva cita'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hora">Hora</Label>
                      <Input
                        id="hora"
                        type="time"
                        value={formData.hora}
                        onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profesional">Profesional</Label>
                    <Select value={formData.profesionalId} onValueChange={(value) => setFormData({ ...formData, profesionalId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un profesional" />
                      </SelectTrigger>
                      <SelectContent>
                        {profesionales.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id.toString()}>
                            {prof.nombre} - {prof.especialidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {user?.role === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="usuario">Paciente</Label>
                      <Select value={formData.usuarioId} onValueChange={(value) => setFormData({ ...formData, usuarioId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios.map((usr) => (
                            <SelectItem key={usr.id} value={usr.id.toString()}>
                              {usr.nombre} - {usr.documento}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value: EstadoCita) => setFormData({ ...formData, estado: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.role === 'admin' ? (
                          <>
                            <SelectItem value={EstadoCita.PENDIENTE}>Pendiente</SelectItem>
                            <SelectItem value={EstadoCita.CONFIRMADA}>Confirmada</SelectItem>
                            <SelectItem value={EstadoCita.CANCELADA}>Cancelada</SelectItem>
                            <SelectItem value={EstadoCita.COMPLETADA}>Completada</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value={EstadoCita.CONFIRMADA}>Confirmada</SelectItem>
                            <SelectItem value={EstadoCita.CANCELADA}>Cancelada</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingCita ? 'Actualizar' : 'Crear'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las citas</SelectItem>
                <SelectItem value={EstadoCita.PENDIENTE}>Pendientes</SelectItem>
                <SelectItem value={EstadoCita.CONFIRMADA}>Confirmadas</SelectItem>
                <SelectItem value={EstadoCita.CANCELADA}>Canceladas</SelectItem>
                <SelectItem value={EstadoCita.COMPLETADA}>Completadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Especialidad</TableHead>
                  {user?.role === 'admin' && <TableHead>Paciente</TableHead>}
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role === 'admin' ? 7 : 6} className="text-center text-gray-500 py-8">
                      No hay citas registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  citasFiltradas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>{new Date(cita.fecha).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {cita.hora}
                      </TableCell>
                      <TableCell>{cita.profesionalNombre}</TableCell>
                      <TableCell className="capitalize">{cita.profesionalEspecialidad?.replace('_', ' ')}</TableCell>
                      {user?.role === 'admin' && <TableCell>{cita.usuarioNombre}</TableCell>}
                      <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(cita)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(cita.id)}
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