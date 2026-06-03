import { circleModule } from './circle/module';
import CircleSettings from './circle/CircleSettings';
import { linesModule } from './lines/module';
import LinesSettings from './lines/LinesSettings';
import { bandsModule } from './bands/module';
import BandsSettings from './bands/BandsSettings';
import { streetViewHiderModule } from './streetViewHider/module';
import { registry } from './registry';

circleModule.SettingsComponent = CircleSettings;
linesModule.SettingsComponent = LinesSettings;
bandsModule.SettingsComponent = BandsSettings;

registry.register(circleModule);
registry.register(linesModule);
registry.register(bandsModule);
registry.register(streetViewHiderModule);

export { registry };
export { circleModule };
export { linesModule };
export { bandsModule };
export { streetViewHiderModule };
