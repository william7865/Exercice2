const fs = require('fs');
const path = require('path');
const os = require('os');
const Task = require('../models/Task');

const DEFAULT_PATH = path.join(os.homedir(), '.todo_express', 'tasks.json');

class JsonRepository {
  constructor(dbPath = process.env.TODO_API_DB || DEFAULT_PATH) {
    this.path = dbPath;
    const dir = path.dirname(this.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, '[]', 'utf-8');
  }
  _read(){ try{ return JSON.parse(fs.readFileSync(this.path, 'utf-8')); } catch(e){ return []; } }
  _write(items){ const tmp=this.path+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(items,null,2)); fs.renameSync(tmp, this.path); }
  all(){ return this._read().map(d=>new Task(d)); }
  get(id){ const it=this._read().find(d=>d.id===id); return it?new Task(it):null; }
  save(task){ const items=this._read(); const i=items.findIndex(d=>d.id===task.id); if(i>=0){ items[i]=task; } else { items.push(task); } this._write(items); return task; }
  delete(id){ const items=this._read(); const after=items.filter(d=>d.id!==id); const changed=after.length!==items.length; if(changed) this._write(after); return changed; }
}
module.exports = JsonRepository;
