# Quick Start — Setup in 3 minuti su Windows

## 0. Verifica Node.js installato

Apri **PowerShell** (cerca "PowerShell" nel menu Start) e digita:

```powershell
node -v
```

- Se vedi un numero (es. `v20.10.0`) → ok, prosegui
- Se vedi "comando non riconosciuto" → vai su https://nodejs.org e scarica la versione **LTS** (l'installer fa tutto in automatico). Riavvia PowerShell e riprova.

## 1. Apri il terminale nella cartella server

Apri **Esplora File** (Win+E) → vai in `C:\Users\ricac\Downloads\wattlab-server`.

Click sulla **barra dell'indirizzo** in alto → cancella tutto → scrivi `powershell` → Enter.

(Il terminale si apre già posizionato nella cartella ✓)

## 2. Setup

Nel terminale, in ordine:

```powershell
copy .env.example .env
```

Crea il file delle config. **Per dev locale puro va bene così com'è**, ma idealmente cambia i secret JWT:

```powershell
notepad .env
```

Modifica solo queste due righe con stringhe random qualsiasi (lunghe almeno 32 caratteri, basta che ci pesti sopra):

```env
JWT_ACCESS_SECRET=dghskdgjlksjdfklsjdflkjsdlksjdkfsjsd
JWT_REFRESH_SECRET=jslkdjflksjdflkjsdklfjlsdfjlsdjflksd
```

Salva e chiudi.

## 3. Installa dipendenze + crea DB

```powershell
npm install
```

(scarica le librerie — 30-60 secondi)

```powershell
npm run db:push
```

(crea il file `wattlab.db` con tutte le tabelle — istantaneo)

## 4. Avvia il server

```powershell
npm run dev
```

Vedi qualcosa tipo:
```
▸ WattLab API running on http://localhost:3000
```

✓ **Server attivo**

## 5. Testa che funzioni

Apri il browser e vai su:
```
http://localhost:3000/health
```

Dovresti vedere `{"ok":true,"uptime":...}` — il server risponde.

## 6. Collega l'app client al server

1. Apri `index.html` nel browser (doppio click sul file)
2. Vai in **pg5 (Profilo)** → tap su **Admin Dashboard** (visibile solo per `piana.richh@gmail.com`)
3. Se è la prima volta, registrati con la tua email nella schermata di login dell'app
4. Tap su **⚙️ Config API URL** → imposta `http://localhost:3000` → conferma
5. La dashboard ora si popola con dati reali dal DB locale ✓

## Comandi utili

- `npm run dev` — avvia il server (auto-reload se modifichi i file)
- `Ctrl+C` nel terminale per fermarlo
- `npm run db:studio` — apre **Drizzle Studio** nel browser per vedere/modificare il DB visivamente

## Dove vivono i dati?

Tutto è dentro `C:\Users\ricac\Downloads\wattlab-server\wattlab.db` (un singolo file).

- Cancellalo per resettare tutto
- Copialo per fare backup
- Non finisce su GitHub (è nel `.gitignore`)

## Quando vorrai metterlo online

SQLite va benissimo anche in produzione per app piccole-medie. Per deploy:

- **Fly.io** con volume persistente → SQLite resta SQLite, deploy in 5min
- **Railway** + SQLite con volume → uguale
- Oppure migri a Postgres (Drizzle ti fa cambiare dialect cambiando 3 file)

Per ora pensiamo a sviluppare. Quando sarà ora di deploy → ti guido.
