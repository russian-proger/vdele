import Event from './Event';
import FileSystem from './FileSystem';
import StringSystem from './String';
import Network from './Network';


export function CoreClass() {
  this.init = function init() {

  };

  // Событийный элемент
  this.Event = new Event(this);

  // Система загрузки и кэширования файлов
  this.File = new FileSystem(this);

  // Дополнительные возможности для работы со строками
  this.String = new StringSystem(this);

  // Объект для взаимодействия с сервером
  this.Network = new Network(this);
}

/** 
 * @type {CoreClass}
 * @global
 */
const Core = new CoreClass();
window.CoreInstance = Core;

export default Core;