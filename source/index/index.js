import './index.scss';
import 'normalize.css';

import createMenu from '../components/menu/menu';
var menu = createMenu(['Home', 'О решении', 'Преимущества', 'Бонусы', 'Контакты'], 'menu');
document.body.appendChild(menu);
