<h1 align="center">
  Asignacion de citas
</h1>

<h3 align="center">
  Aplicacion creada para facilitar la asignacion de citas de una eps
</h3>
<p align="center" style="font-size: small;">Thanks for 300 stars! - frthr</p>

# Intro

en la actualidad, la gestíon eficiente del tiempo y la organizacion de citas se han convertido en una necesidad fundamental para insituciones y profecionales que brindan atencion al publico

# Contribute

el desarrollo de estre proyecto contribuye a la digitalizacion y automatizacion del proceso de asignacion de citas, permitiendo una mejor organizacion del tiempo y los recursos de las instituciones y profecionales.

# Historias De Usuario

Historia de Usuario 1: Agendar una cita médica

Como paciente
Quiero agendar una cita médica seleccionando especialidad, médico y fecha
Para poder recibir atención médica sin tener que ir presencialmente

Criterios de aceptación:

El sistema muestra una lista de especialidades médicas disponibles.

Al seleccionar una especialidad, se muestran los médicos asociados.

El paciente puede ver fechas y horarios disponibles del médico.

El sistema no permite seleccionar horarios ya ocupados.

Al confirmar, la cita queda registrada y se muestra un mensaje de éxito.

El paciente recibe confirmación de la cita (en pantalla o por correo).

Historia de Usuario 2: Ver mis citas agendadas

Como paciente
Quiero visualizar mis citas médicas agendadas
Para llevar control de mis consultas y no olvidar mis citas

Criterios de aceptación:

El paciente debe estar autenticado.

El sistema muestra un listado de citas futuras y pasadas.

Cada cita muestra: médico, especialidad, fecha y hora.

Las citas futuras se diferencian visualmente de las pasadas.

El listado se carga correctamente desde la base de datos.

Historia de Usuario 3: Cancelar una cita médica

Como paciente
Quiero cancelar una cita médica agendada
Para liberar el cupo si no puedo asistir

Criterios de aceptación:

El sistema solo permite cancelar citas futuras.

Se solicita confirmación antes de cancelar la cita.

Al cancelar, el horario vuelve a estar disponible.

El sistema muestra un mensaje de confirmación.

La cita cancelada ya no aparece como activa.

## Funcionalidades
 Registro de usuarios
Inicio de sesión
Creación de citas
Edición y cancelación de citas
Visualización de citas programadas
Administración de servicios
Gestión de horarios disponibles

## Tecnologías Utilizadas
Backend

Node.js

Express.js

MySQL

Express MyConnection

EJS (Motor de plantillas)

Frontend

HTML5

CSS3

JavaScript

Figma

## Herramientas

Git Git Hub
