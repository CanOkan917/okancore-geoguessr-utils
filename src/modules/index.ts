import { circleModule } from './circle/module';
import CircleSettings from './circle/CircleSettings';
import { streetViewHiderModule } from './streetViewHider/module';
import { registry } from './registry';

circleModule.SettingsComponent = CircleSettings;

registry.register(circleModule);
registry.register(streetViewHiderModule);

export { registry };
export { circleModule };
export { streetViewHiderModule };
