import { circleModule } from './circle/module';
import CircleSettings from './circle/CircleSettings';
import { linesModule } from './lines/module';
import LinesSettings from './lines/LinesSettings';
import { streetViewHiderModule } from './streetViewHider/module';
import { registry } from './registry';

circleModule.SettingsComponent = CircleSettings;
linesModule.SettingsComponent = LinesSettings;

registry.register(circleModule);
registry.register(linesModule);
registry.register(streetViewHiderModule);

export { registry };
export { circleModule };
export { linesModule };
export { streetViewHiderModule };
