const fs = require('node:fs');
const path = require('node:path');
const stockDir = path.join(__dirname, '..', 'stock');
const servicesConfigPath = path.join(__dirname, '..', 'services.json');

const getServicesConfig = () => {
    try {
        if (!fs.existsSync(servicesConfigPath)) {
            fs.writeFileSync(servicesConfigPath, JSON.stringify({}));
        }
        const data = fs.readFileSync(servicesConfigPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur lecture services.json:", error);
        return {};
    }
};

const saveServicesConfig = (config) => {
    try {
        fs.writeFileSync(servicesConfigPath, JSON.stringify(config, null, 4));
    } catch (error) {
        console.error("Erreur écriture services.json:", error);
    }
};

const ensureStockDir = () => {
    if (!fs.existsSync(stockDir)) {
        fs.mkdirSync(stockDir, { recursive: true });
    }
};

const getServices = () => {
    const config = getServicesConfig();
    return Object.keys(config);
};

const getStockCount = (serviceName) => {
    ensureStockDir();
    const filePath = path.join(stockDir, `${serviceName}.txt`);
    try {
        if (!fs.existsSync(filePath)) return 0;
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '').length;
    } catch (error) {
        console.error(`Erreur lecture stock ${serviceName}:`, error);
        return 0;
    }
};

const getAllStock = () => {
    const config = getServicesConfig();
    return Object.entries(config).map(([name, emoji]) => ({
        name: name,
        emoji: emoji,
        count: getStockCount(name)
    })).sort((a, b) => a.name.localeCompare(b.name));
};

const createService = (serviceName, emoji) => {
    ensureStockDir();
    const config = getServicesConfig();
    
    config[serviceName] = emoji;
    saveServicesConfig(config);

    const filePath = path.join(stockDir, `${serviceName}.txt`);
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
        }
        return true;
    } catch (error) {
        console.error(`Erreur création fichier ${serviceName}.txt:`, error);
        return false;
    }
};

const addAccount = (serviceName, accountData) => {
    ensureStockDir();
    const services = getServices();
    if (!services.includes(serviceName)) return false;

    const filePath = path.join(stockDir, `${serviceName}.txt`);
    try {
        fs.appendFileSync(filePath, `${accountData}\n`);
        return true;
    } catch (error) {
        console.error(`Erreur ajout compte ${serviceName}:`, error);
        return false;
    }
};

const generateAccount = (serviceName) => {
    ensureStockDir();
    const filePath = path.join(stockDir, `${serviceName}.txt`);
    try {
        if (!fs.existsSync(filePath)) return null;

        const data = fs.readFileSync(filePath, 'utf8');
        let lines = data.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) return null;

        const account = lines.shift();
        fs.writeFileSync(filePath, lines.join('\n'));

        return account;
    } catch (error) {
        console.error(`Erreur génération compte ${serviceName}:`, error);
        return null;
    }
};

module.exports = {
    getServices,
    getStockCount,
    getAllStock,
    createService,
    addAccount,
    generateAccount
};
