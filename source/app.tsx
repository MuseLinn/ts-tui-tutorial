
import {AppProvider} from './context/AppContext.js';
import {curriculum} from './data/curriculum/index.js';
import Layout from './components/Layout.js';

export default function App() {
	return (
		<AppProvider lessons={curriculum}>
			<Layout />
		</AppProvider>
	);
}
