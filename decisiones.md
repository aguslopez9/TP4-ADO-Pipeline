# tp4

### evidencia
https://docs.google.com/document/d/1WFx6Xz7mDej7-FSfUFCJnelyn1ORixMqke-LrExlejM/edit?usp=sharing

### que es un agente self-hosted?

es una maquina local que ejecuta los trabajos del pipeline en lugar de usar los servidores de Microsoft.

**agentes de microsoft (hosted):**
- microsoft proporciona las maquinas
- limitaciones de recursos 
- software preinstalado
- costo por minuto de ejecucion

**agente self-hosted:**
- yo proporciono la maquina
- control total sobre recursos y software
- puedo instalar lo que necesite
- costo fijo (electricidad)

**por que elegi self-hosted?**
- **control**: instalo node.js, npm, las versiones que necesito
- **debugging**: puedo ver que pasa localmente

### que es un pipeline CI?


es una secuencia automatizada de pasos que se ejecuta cada vez que hago cambios en el codigo.

**que hace mi pipeline?**
1. **trigger**: se ejecuta automaticamente cuando hago `git push`
2. **build**: compila el codigo (frontend y backend)
3. **test**: ejecuta tests automaticamente
4. **package**: empaqueta los resultados (artefactos)
5. **notify**: me dice si todo salio bien o no

**por que es importante?**
- **automatizacion**: no tengo que recordar hacer build manualmente
- **consistencia**: siempre se ejecuta igual, sin errores humanos
- **calidad**: los tests se ejecutan automaticamente
- **trazabilidad**: historial de todos los builds

### que son los artefactos?

son los "paquetes" que resultan del build. es como empaquetar tu aplicacion lista para usar.

**en mi proyecto:**
- **frontend-dist**: todos los archivos html, css, js del frontend
- **backend-dist**: el codigo del backend + dependencias

**para que sirven?**
- **deployment**: base para desplegar la aplicacion
- **registro**: que se construyo en cada ejecucion
- **trazabilidad**: historial de versiones
- **distribucion**: puedo descargar y usar estos paquetes

si fuera una app de produccion, los artefactos serian:
- frontend: archivos optimizados para un servidor web
- backend: codigo compilado + dependencias para un servidor

### que es el build process?

es el proceso de "construir" tu aplicacion desde codigo fuente hasta algo ejecutable.

**en mi proyecto:**

**frontend build:**
```bash
npm ci          # instala dependencias
npm run build   # "compila" (en este caso solo valida)
```

**backend build:**
```bash
npm ci          # instala dependencias
npm run build   # compila typescript a javascript
npm test        # ejecuta tests
```

**por que es importante el build?**
- **validacion**: verifica que el codigo funciona
- **optimizacion**: prepara el codigo para produccion
- **dependencias**: instala todo lo necesario
- **testing**: ejecuta tests automaticamente

## arquitectura elegida

### frontend: html + css + javascript
**por que?**
- **simplicidad**: no necesito frameworks complejos para demostrar un pipeline
- **rapido**: se ejecuta sin build steps complicados
- **claro**: cualquiera puede entender el codigo

### backend: node.js + express
**por que?**
- **mismo lenguaje**: javascript en frontend y backend
- **express**: framework minimalista, perfecto para apis simples
- **npm**: gestion de dependencias estandar

### monorepo
**por que?**
- **un solo repo**: facil de manejar
- **pipeline unico**: un solo archivo yaml para todo
- **versionado coordinado**: frontend y backend siempre sincronizados

## agente self-hosted

### como lo configure?
1. **crear pool**: en azure devops → project settings → agent pools → "selfhosted"
2. **descargar agente**: desde azure devops, descargue el software del agente
3. **instalar**: lo instale en mi mac como servicio
4. **configurar**: le di permisos para conectarse a azure devops
5. **verificar**: ahora aparece como "online" en azure devops

### por que como servicio?
- **automatico**: se ejecuta cuando enciendo la computadora
- **persistente**: no se cierra si cierro la terminal
- **profesional**: es como tener un servidor dedicado

## pipeline CI

### estructura multi-stage
```yaml
stages:
- stage: CI
  jobs:
  - job: BuildFrontend
  - job: BuildBackend
```
un job es una unidad de trabajo que se ejecuta en un agente. es como una "tarea" que el pipeline debe completar.

**caracteristicas de un job:**
- **independiente**: cada job corre por separado
- **paralelo**: pueden ejecutarse al mismo tiempo
- **especifico**: cada job tiene un proposito claro
- **agente**: cada job se ejecuta en un agente (en mi caso, el mismo self-hosted)

**por que jobs separados?**
- **paralelizacion**: se ejecutan al mismo tiempo
- **independencia**: si uno falla, el otro continua
- **claridad**: facil ver que hace cada parte

### build process detallado

**frontend:**
```yaml
- script: |
    npm ci          # instala dependencias limpias
    npm run build   # "compila" (valida archivos)
```

**backend:**
```yaml
- script: |
    npm ci          # instala dependencias
    npm run build   # compila codigo
    npm test        # ejecuta tests
```

**por que estos comandos?**
- `npm ci`: instala dependencias de forma limpia (mas rapido que `npm install`)
- `npm run build`: compila el codigo para produccion
- `npm test`: ejecuta tests (con `continueOnError: true` para no fallar el pipeline)

### artefactos explicados
```yaml
- task: PublishPipelineArtifact@1
  inputs:
    targetPath: 'front'           # carpeta a empaquetar
    artifact: 'frontend-dist'     # nombre del paquete
```

**que contiene cada artefacto?**
- **frontend-dist**: html, css, js listos para un servidor web
- **backend-dist**: codigo fuente + dependencias para ejecutar

## flujo de trabajo

### 1. desarrollo local
```bash
# terminal 1 - backend
npm run start:back  # puerto 5000

# terminal 2 - frontend  
npm run start:front  # puerto 3000
```

### 2. commit y push
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### 3. pipeline automatico
- **trigger**: push a `main` activa el pipeline
- **agente**: self-hosted en mi mac ejecuta los jobs
- **jobs**: buildfrontend + buildbackend en paralelo
- **artefactos**: frontend-dist + backend-dist se publican


### conceptos tecnicos
1. **agentes self-hosted**: como instalar y configurar
2. **yaml pipelines**: sintaxis y estructura
3. **jobs paralelos**: optimizacion de tiempo
4. **artefactos**: empaquetado y publicacion
5. **triggers**: automatizacion de ejecucion

### conceptos de ci/cd
1. **continuous integration**: integracion continua
2. **build automation**: automatizacion de builds
3. **testing**: tests automaticos
4. **packaging**: empaquetado de aplicaciones
5. **deployment**: preparacion para despliegue

### por que es importante el ci?
- **automatizacion**: no tengo que recordar hacer build manualmente
- **consistencia**: siempre se ejecuta igual
- **calidad**: los tests se ejecutan automaticamente
- **trazabilidad**: historial de todos los builds

### por que self-hosted?
- **flexibilidad**: puedo instalar lo que necesite
- **performance**: mi maquina es mas rapida
- **control**: veo exactamente que esta pasando
- **aprendizaje**: entiendo mejor el proceso

### por que esta estructura?
- **simplicidad**: facil de entender y mantener
- **escalabilidad**: facil agregar mas jobs o stages
- **estandar**: sigue las mejores practicas

### por que yaml y no classic para este caso?

**yaml es mejor porque:**

**versionado:**
- el pipeline esta en el repositorio junto con el codigo
- puedo hacer commit de cambios al pipeline
- historial completo de cambios
- colaboracion: otros desarrolladores pueden ver y modificar el pipeline

**flexibilidad:**
- puedo usar condicionales y loops
- reutilizar templates
- estructuras complejas (multi-stage, multi-job)
- integracion con git (triggers por rama, path, etc.)

**mantenimiento:**
- un solo archivo para todo el pipeline
- sintaxis clara y legible
- facil de debuggear
- portabilidad entre proyectos

**classic seria peor porque:**
- configuracion en la ui de azure devops
- no versionado automatico
- limitado a funcionalidades basicas
- dificil de replicar en otros proyectos

### que ventajas concretas tiene usar un agente self-hosted frente a uno microsoft-hosted en mi escenario?

**ventajas del self-hosted:**

**control total:**
- puedo instalar herramientas adicionales que necesite
- configuracion personalizada del entorno
- no dependo de lo que microsoft tenga preinstalado

**performance:**
- no hay limitaciones de cpu/memoria
- tiempo de ejecucion ilimitado 
- red local mas rapida para descargar dependencias

### como estructurarias el pipeline para que el build del front y del back sean independientes pero parte de la misma integracion continua?

**mi estructura actual:**

```yaml
stages:
- stage: CI
  jobs:
  - job: BuildFrontend    # independiente
  - job: BuildBackend      # independiente
```

**por que esta estructura es ideal:**

**independencia:**
- cada job tiene sus propias dependencias
- si frontend falla, backend puede continuar
- si backend falla, frontend puede continuar
- cada uno tiene su propio agente (o el mismo pero separado)

**paralelizacion:**
- ambos jobs se ejecutan al mismo tiempo
- tiempo total = tiempo del job mas lento 
- optimizacion de recursos
- mas rapido que ejecutar secuencialmente

**misma integracion continua:**
- un solo trigger (push a main)
- un solo pipeline para toda la aplicacion
- artefactos coordinados (frontend-dist + backend-dist)
- notificaciones unificadas