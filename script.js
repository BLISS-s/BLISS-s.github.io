// Данные автомобилей
const carsData = [
    {
        id: 1,
        brand: 'Toyota',
        model: 'Camry',
        year: 2024,
        price: 2800000,
        engine: '2.5L',
        power: 181,
        transmission: 'Автомат',
        drive: 'Передний',
        fuel: 'Бензин',
        consumption: '7.8',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500',
        tag: 'Новинка'
    },
    {
        id: 2,
        brand: 'BMW',
        model: 'X5',
        year: 2024,
        price: 8500000,
        engine: '3.0L',
        power: 340,
        transmission: 'Автомат',
        drive: 'Полный',
        fuel: 'Бензин',
        consumption: '9.5',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
        tag: 'Премиум'
    },
    {
        id: 3,
        brand: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2023,
        price: 7200000,
        engine: '2.0L',
        power: 249,
        transmission: 'Автомат',
        drive: 'Задний',
        fuel: 'Бензин',
        consumption: '7.2',
        image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f84f8?w=500',
        tag: 'Хит'
    },
    {
        id: 4,
        brand: 'Audi',
        model: 'Q7',
        year: 2024,
        price: 7800000,
        engine: '3.0L',
        power: 333,
        transmission: 'Автомат',
        drive: 'Полный',
        fuel: 'Бензин',
        consumption: '8.9',
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500',
        tag: 'Новинка'
    },
    {
        id: 5,
        brand: 'Honda',
        model: 'Accord',
        year: 2023,
        price: 3200000,
        engine: '2.0L',
        power: 190,
        transmission: 'Вариатор',
        drive: 'Передний',
        fuel: 'Бензин',
        consumption: '6.5',
        image: 'https://images.unsplash.com/photo-1619767886558-efdc7b9e0473?w=500',
        tag: 'Эконом'
    },
    {
        id: 6,
        brand: 'Lexus',
        model: 'RX 350',
        year: 2024,
        price: 6800000,
        engine: '3.5L',
        power: 300,
        transmission: 'Автомат',
        drive: 'Полный',
        fuel: 'Бензин',
        consumption: '9.2',
        image: 'https://images.unsplash.com/photo-1626668011440-3c5b6c0d3c3c?w=500',
        tag: 'Премиум'
    }
];

// Данные пользователя
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users') || '[]');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
let testDriveHistory = JSON.parse(localStorage.getItem('testDriveHistory') || '[]');

// Массив для хранения выбранных автомобилей для сравнения
let comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]').map(id => 
    carsData.find(car => car.id === id)
).filter(car => car);

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

// Создание карточки автомобиля
function createCarCard(car) {
    const isInComparison = comparisonList.some(c => c && c.id === car.id);
    const isInFavorites = currentUser && favorites.some(f => f.userId === currentUser.id && f.carId === car.id);
    const compareButtonText = isInComparison ? 'В сравнении' : 'Сравнить';
    const compareButtonStyle = isInComparison ? '#48bb78' : '#667eea';
    
    return `
        <div class="car-card" data-id="${car.id}">
            <div class="car-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}" onerror="this.src='https://via.placeholder.com/500x300?text=${car.brand}+${car.model}'">
                <span class="car-tag">${car.tag}</span>
            </div>
            <div class="car-info">
                <div class="car-header">
                    <h3 class="car-name">${car.brand} ${car.model}</h3>
                    <span class="car-year">${car.year}</span>
                </div>
                <div class="car-price">${formatPrice(car.price)}</div>
                <div class="car-specs">
                    <div class="spec-item">
                        <span class="spec-label">Двигатель</span>
                        <span class="spec-value">${car.engine}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Мощность</span>
                        <span class="spec-value">${car.power} л.с.</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">КПП</span>
                        <span class="spec-value">${car.transmission}</span>
                    </div>
                </div>
                <div class="car-actions">
                    <button class="btn-card btn-details" onclick="showCarDetails(${car.id})">Подробнее</button>
                    <button class="btn-card btn-compare" onclick="${isInComparison ? `removeFromComparison(${car.id})` : `addToComparison(${car.id})`}" style="background: ${compareButtonStyle}">${compareButtonText}</button>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="btn-testdrive" onclick="openTestDriveModal(${car.id})" style="flex: 2;">Тест-драйв</button>
                    <button class="btn-favorite ${isInFavorites ? 'active' : ''}" onclick="toggleFavorite(${car.id})" style="flex: 1;">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Отображение всех автомобилей
function displayCars() {
    const carsGrid = document.getElementById('carsGrid');
    if (carsGrid) {
        carsGrid.innerHTML = carsData.map(car => createCarCard(car)).join('');
    }
}

// Показ детальной информации
function showCarDetails(carId) {
    const car = carsData.find(c => c.id === carId);
    
    // Добавляем в историю просмотров
    if (currentUser) {
        addToViewHistory(carId);
    }
    
    // Закрываем предыдущее модальное окно
    closeModal();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'carModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h2>${car.brand} ${car.model}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="car-detail-image">
                    <img src="${car.image}" alt="${car.brand} ${car.model}" onerror="this.src='https://via.placeholder.com/800x400?text=${car.brand}+${car.model}'">
                </div>
                <div style="margin: 20px 0;">
                    <h2 style="color: #667eea;">${formatPrice(car.price)}</h2>
                    <p style="color: #666;">${car.year} год выпуска</p>
                </div>
                <h3>Характеристики</h3>
                <div class="specs-grid">
                    <div class="spec-item-detail">
                        <span class="spec-label-detail">Двигатель</span>
                        <span class="spec-value-detail">${car.engine}</span>
                    </div>
                    <div class="spec-item-detail">
                        <span class="spec-label-detail">Мощность</span>
                        <span class="spec-value-detail">${car.power} л.с.</span>
                    </div>
                    <div class="spec-item-detail">
                        <span class="spec-label-detail">Коробка передач</span>
                        <span class="spec-value-detail">${car.transmission}</span>
                    </div>
                    <div class="spec-item-detail">
                        <span class="spec-label-detail">Привод</span>
                        <span class="spec-value-detail">${car.drive}</span>
                    </div>
                    <div class="spec-item-detail">
                        <span class="spec-label-detail">Топливо</span>
                        <span class="spec-value-detail">${car.fuel}</span>
                    </div>
                    <div class="spec-item-detail">
                        <span class="spec-label-detail">Расход</span>
                        <span class="spec-value-detail">${car.consumption} л/100км</span>
                    </div>
                </div>
                <div style="margin-top: 30px; display: flex; gap: 15px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="openTestDriveModal(${car.id})">Записаться на тест-драйв</button>
                    <button class="btn btn-secondary" style="flex: 1;" onclick="closeModal()">Закрыть</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('carModal');
    if (modal) {
        modal.remove();
    }
}

// ==================== АВТОРИЗАЦИЯ ====================

function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { ...user };
        delete currentUser.password;
        
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        updateUIForLoggedInUser();
        closeAuthModal();
        showNotification('Добро пожаловать, ' + user.firstName + '!', 'success');
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

function register(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Введите телефон в формате +7 (999) 999-99-99', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        password,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Регистрация прошла успешно!', 'success');
    switchAuthTab('login');
    document.getElementById('registerForm').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
    closeUserDropdown();
    showNotification('Вы вышли из аккаунта', 'info');
    displayCars();
}

function updateUIForLoggedInUser() {
    const authButton = document.getElementById('authButton');
    const userMenu = document.getElementById('userMenu');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (currentUser) {
        authButton.style.display = 'none';
        userMenu.style.display = 'block';
        userNameDisplay.textContent = `${currentUser.firstName}`;
        displayCars();
    }
}

function updateUIForLoggedOutUser() {
    const authButton = document.getElementById('authButton');
    const userMenu = document.getElementById('userMenu');
    
    authButton.style.display = 'block';
    userMenu.style.display = 'none';
}

function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('show');
}

function closeUserDropdown() {
    document.getElementById('userDropdown').classList.remove('show');
}

// ==================== ПРОФИЛЬ ====================

function openProfileModal() {
    if (!currentUser) {
        showNotification('Необходимо войти в систему', 'error');
        openAuthModal();
        return;
    }
    
    const modal = document.getElementById('profileModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('profileFirstName').value = currentUser.firstName || '';
    document.getElementById('profileLastName').value = currentUser.lastName || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePhone').value = currentUser.phone || '';
    document.getElementById('profileCity').value = currentUser.city || '';
    document.getElementById('profileAddress').value = currentUser.address || '';
    
    closeUserDropdown();
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateProfile(event) {
    event.preventDefault();
    
    const updatedUser = {
        ...currentUser,
        firstName: document.getElementById('profileFirstName').value,
        lastName: document.getElementById('profileLastName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        city: document.getElementById('profileCity').value,
        address: document.getElementById('profileAddress').value
    };
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (currentPassword && newPassword) {
        const user = users.find(u => u.id === currentUser.id);
        if (user.password !== currentPassword) {
            showNotification('Неверный текущий пароль', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showNotification('Новые пароли не совпадают', 'error');
            return;
        }
        
        user.password = newPassword;
        updatedUser.password = newPassword;
    }
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateUIForLoggedInUser();
    closeProfileModal();
    showNotification('Профиль успешно обновлен', 'success');
}

function changeAvatar() {
    showNotification('Функция смены аватара будет доступна позже', 'info');
}

// ==================== ИЗБРАННОЕ ====================

function openFavoritesModal() {
    if (!currentUser) {
        showNotification('Необходимо войти в систему', 'error');
        openAuthModal();
        return;
    }
    
    document.getElementById('favoritesModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    displayFavorites();
    closeUserDropdown();
}

function closeFavoritesModal() {
    document.getElementById('favoritesModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function displayFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    const userFavorites = favorites
        .filter(f => f.userId === currentUser.id)
        .map(f => carsData.find(car => car.id === f.carId))
        .filter(car => car);
    
    if (userFavorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-heart" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
                <p style="color: #999; font-size: 18px;">У вас пока нет избранных автомобилей</p>
                <button class="btn btn-primary" style="margin-top: 20px;" onclick="closeFavoritesModal()">Продолжить просмотр</button>
            </div>
        `;
        return;
    }
    
    favoritesGrid.innerHTML = userFavorites.map(car => `
        <div class="favorite-card">
            <button class="remove-favorite" onclick="removeFromFavorites(${car.id})">&times;</button>
            <div class="car-image-small">
                <img src="${car.image}" alt="${car.brand} ${car.model}">
            </div>
            <h3>${car.brand} ${car.model}</h3>
            <div class="price">${formatPrice(car.price)}</div>
            <div class="favorite-actions">
                <button class="btn-card btn-details" style="flex: 1;" onclick="showCarDetails(${car.id}); closeFavoritesModal();">Подробнее</button>
                <button class="btn-testdrive" style="flex: 1; margin: 0;" onclick="openTestDriveModal(${car.id}); closeFavoritesModal();">Тест-драйв</button>
            </div>
        </div>
    `).join('');
}

function toggleFavorite(carId) {
    if (!currentUser) {
        showNotification('Необходимо войти в систему', 'error');
        openAuthModal();
        return;
    }
    
    const existingIndex = favorites.findIndex(f => f.userId === currentUser.id && f.carId === carId);
    
    if (existingIndex === -1) {
        favorites.push({
            userId: currentUser.id,
            carId: carId,
            date: new Date().toISOString()
        });
        showNotification('Добавлено в избранное', 'success');
    } else {
        favorites.splice(existingIndex, 1);
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayCars();
    
    if (document.getElementById('favoritesModal').classList.contains('active')) {
        displayFavorites();
    }
}

function removeFromFavorites(carId) {
    const index = favorites.findIndex(f => f.userId === currentUser.id && f.carId === carId);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        displayCars();
        showNotification('Удалено из избранного', 'info');
    }
}

// ==================== ИСТОРИЯ ПРОСМОТРОВ ====================

function openHistoryModal() {
    if (!currentUser) {
        showNotification('Необходимо войти в систему', 'error');
        openAuthModal();
        return;
    }
    
    document.getElementById('historyModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    displayViewHistory();
    closeUserDropdown();
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToViewHistory(carId) {
    if (!currentUser) return;
    
    const car = carsData.find(c => c.id === carId);
    if (!car) return;
    
    const existingIndex = viewHistory.findIndex(h => h.userId === currentUser.id && h.carId === carId);
    if (existingIndex !== -1) {
        viewHistory.splice(existingIndex, 1);
    }
    
    viewHistory.unshift({
        userId: currentUser.id,
        carId: carId,
        carBrand: car.brand,
        carModel: car.model,
        carImage: car.image,
        date: new Date().toISOString()
    });
    
    if (viewHistory.length > 20) {
        viewHistory = viewHistory.slice(0, 20);
    }
    
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

function displayViewHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const userHistory = viewHistory.filter(h => h.userId === currentUser.id);
    
    if (userHistory.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-history" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
                <p style="color: #999; font-size: 18px;">История просмотров пуста</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = userHistory.map(item => `
        <div class="history-item">
            <div class="history-image">
                <img src="${item.carImage}" alt="${item.carBrand} ${item.carModel}">
            </div>
            <div class="history-info">
                <h4>${item.carBrand} ${item.carModel}</h4>
                <div class="date">${new Date(item.date).toLocaleString('ru-RU')}</div>
            </div>
            <div class="history-actions">
                <button class="btn-card btn-details" onclick="showCarDetails(${item.carId}); closeHistoryModal();">Смотреть</button>
                <button class="btn-testdrive" style="margin: 0;" onclick="openTestDriveModal(${item.carId}); closeHistoryModal();">Тест-драйв</button>
            </div>
        </div>
    `).join('');
}

// ==================== ИСТОРИЯ ТЕСТ-ДРАЙВОВ ====================

function openTestDriveHistoryModal() {
    if (!currentUser) {
        showNotification('Необходимо войти в систему', 'error');
        openAuthModal();
        return;
    }
    
    document.getElementById('testDriveHistoryModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    displayTestDriveHistory();
    closeUserDropdown();
}

function closeTestDriveHistoryModal() {
    document.getElementById('testDriveHistoryModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function displayTestDriveHistory() {
    const historyList = document.getElementById('testDriveHistoryList');
    if (!historyList) return;
    
    const userTestDrives = testDriveHistory.filter(t => t.userId === currentUser.id);
    
    if (userTestDrives.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-calendar-check" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
                <p style="color: #999; font-size: 18px;">У вас пока нет записей на тест-драйв</p>
                <button class="btn btn-primary" style="margin-top: 20px;" onclick="closeTestDriveHistoryModal(); openTestDriveModal();">Записаться</button>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = userTestDrives.map(item => {
        const statusClass = 
            item.status === 'confirmed' ? 'status-confirmed' :
            item.status === 'completed' ? 'status-completed' :
            item.status === 'cancelled' ? 'status-cancelled' : 'status-pending';
        
        const statusText = 
            item.status === 'confirmed' ? 'Подтвержден' :
            item.status === 'completed' ? 'Пройден' :
            item.status === 'cancelled' ? 'Отменен' : 'Ожидает';
        
        return `
            <div class="testdrive-item">
                <div class="testdrive-header">
                    <h3>${item.car}</h3>
                    <span class="testdrive-status ${statusClass}">${statusText}</span>
                </div>
                <div class="testdrive-details">
                    <div class="testdrive-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(item.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div class="testdrive-detail">
                        <i class="fas fa-clock"></i>
                        <span>${item.time}</span>
                    </div>
                    <div class="testdrive-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${item.dealership}</span>
                    </div>
                </div>
                ${item.status === 'pending' ? `
                    <div class="testdrive-actions">
                        <button class="btn-card btn-details" onclick="cancelTestDrive(${item.id})">Отменить</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function cancelTestDrive(id) {
    const index = testDriveHistory.findIndex(t => t.id === id);
    if (index !== -1) {
        testDriveHistory[index].status = 'cancelled';
        localStorage.setItem('testDriveHistory', JSON.stringify(testDriveHistory));
        displayTestDriveHistory();
        showNotification('Запись на тест-драйв отменена', 'info');
    }
}

// ==================== ТЕСТ-ДРАЙВ ====================

function openTestDriveModal(carId = null) {
    if (!currentUser) {
        showNotification('Необходимо войти в систему', 'error');
        openAuthModal();
        return;
    }
    
    const modal = document.getElementById('testDriveModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    document.getElementById('firstName').value = currentUser.firstName || '';
    document.getElementById('lastName').value = currentUser.lastName || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('email').value = currentUser.email || '';
    
    const carSelect = document.getElementById('carModel');
    carSelect.innerHTML = '<option value="">-- Выберите модель --</option>' + 
        carsData.map(car => `<option value="${car.brand} ${car.model}" ${carId === car.id ? 'selected' : ''}>${car.brand} ${car.model}</option>`).join('');
    
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

function closeTestDriveModal() {
    document.getElementById('testDriveModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('testDriveForm').reset();
}

function submitTestDrive(event) {
    event.preventDefault();
    
    const formData = {
        id: Date.now(),
        userId: currentUser.id,
        car: document.getElementById('carModel').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        dealership: document.getElementById('dealership').value,
        comments: document.getElementById('comments').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    if (!formData.car) {
        showNotification('Выберите автомобиль', 'error');
        return;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(formData.phone)) {
        showNotification('Введите телефон в формате +7 (999) 999-99-99', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Введите корректный email', 'error');
        return;
    }
    
    if (!document.getElementById('agree').checked) {
        showNotification('Необходимо согласие на обработку персональных данных', 'error');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        testDriveHistory.push(formData);
        localStorage.setItem('testDriveHistory', JSON.stringify(testDriveHistory));
        
        showNotification('Заявка на тест-драйв отправлена!', 'success');
        closeTestDriveModal();
    }, 1500);
}

// ==================== СРАВНЕНИЕ ====================

function addToComparison(carId) {
    if (comparisonList.length >= 3) {
        showNotification('Можно выбрать не более 3 автомобилей', 'error');
        return;
    }
    
    const car = carsData.find(c => c.id === carId);
    if (comparisonList.some(c => c && c.id === carId)) {
        showNotification('Автомобиль уже добавлен к сравнению', 'error');
        return;
    }
    
    comparisonList.push(car);
    updateComparisonBadge();
    saveComparisonList();
    showNotification(`${car.brand} ${car.model} добавлен к сравнению`, 'success');
    displayCars();
    
    if (document.getElementById('compareModal').classList.contains('active')) {
        displayComparisonCards();
    }
}

function removeFromComparison(carId) {
    const car = comparisonList.find(c => c && c.id === carId);
    comparisonList = comparisonList.filter(c => c && c.id !== carId);
    updateComparisonBadge();
    saveComparisonList();
    showNotification(`${car.brand} ${car.model} удален из сравнения`, 'info');
    displayCars();
    
    if (document.getElementById('compareModal').classList.contains('active')) {
        displayComparisonCards();
    }
}

function saveComparisonList() {
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList.map(c => c.id)));
}

function updateComparisonBadge() {
    const badge = document.getElementById('compareBadge');
    if (badge) {
        if (comparisonList.length > 0) {
            badge.textContent = comparisonList.length;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
}

function openCompareModal() {
    document.getElementById('compareModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    displayComparisonCards();
}

function closeCompareModal() {
    document.getElementById('compareModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function displayComparisonCards() {
    const compareGrid = document.getElementById('compareGrid');
    if (!compareGrid) return;
    
    if (comparisonList.length === 0) {
        compareGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <p style="color: #999; font-size: 18px;">Добавьте автомобили для сравнения</p>
            </div>
        `;
        document.getElementById('compareBtn').disabled = true;
        return;
    }
    
    compareGrid.innerHTML = comparisonList.map(car => `
        <div class="compare-card selected">
            <button class="remove-btn" onclick="removeFromComparison(${car.id})">&times;</button>
            <div class="car-image-small">
                <img src="${car.image}" alt="${car.brand} ${car.model}">
            </div>
            <h3 style="margin-bottom: 10px;">${car.brand} ${car.model}</h3>
            <div style="font-size: 20px; font-weight: 700; color: #667eea; margin-bottom: 15px;">${formatPrice(car.price)}</div>
            <div class="compare-specs">
                <div class="compare-spec-row">
                    <span class="compare-spec-label">Год:</span>
                    <span class="compare-spec-value">${car.year}</span>
                </div>
                <div class="compare-spec-row">
                    <span class="compare-spec-label">Двигатель:</span>
                    <span class="compare-spec-value">${car.engine}</span>
                </div>
                <div class="compare-spec-row">
                    <span class="compare-spec-label">Мощность:</span>
                    <span class="compare-spec-value">${car.power} л.с.</span>
                </div>
                <div class="compare-spec-row">
                    <span class="compare-spec-label">КПП:</span>
                    <span class="compare-spec-value">${car.transmission}</span>
                </div>
                <div class="compare-spec-row">
                    <span class="compare-spec-label">Привод:</span>
                    <span class="compare-spec-value">${car.drive}</span>
                </div>
                <div class="compare-spec-row">
                    <span class="compare-spec-label">Расход:</span>
                    <span class="compare-spec-value">${car.consumption} л/100км</span>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('compareBtn').disabled = comparisonList.length < 2;
    document.getElementById('compareCount').textContent = `Выбрано: ${comparisonList.length}/3`;
}

function compareCars() {
    if (comparisonList.length < 2) {
        showNotification('Выберите минимум 2 автомобиля', 'error');
        return;
    }
    
    const compareGrid = document.getElementById('compareGrid');
    
    const oldResults = document.querySelector('.compare-results');
    if (oldResults) {
        oldResults.remove();
    }
    
    const comparisonTable = document.createElement('div');
    comparisonTable.className = 'compare-results';
    comparisonTable.innerHTML = `
        <h3 style="margin-bottom: 20px;">Результаты сравнения</h3>
        <table class="compare-table">
            <thead>
                <tr>
                    <th>Характеристика</th>
                    ${comparisonList.map(car => `<th>${car.brand} ${car.model}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Цена</td>
                    ${comparisonList.map(car => `<td>${formatPrice(car.price)}</td>`).join('')}
                </tr>
                <tr>
                    <td>Год</td>
                    ${comparisonList.map(car => `<td>${car.year}</td>`).join('')}
                </tr>
                <tr>
                    <td>Двигатель</td>
                    ${comparisonList.map(car => `<td>${car.engine}</td>`).join('')}
                </tr>
                <tr>
                    <td>Мощность</td>
                    ${comparisonList.map(car => `<td>${car.power} л.с.</td>`).join('')}
                </tr>
                <tr>
                    <td>КПП</td>
                    ${comparisonList.map(car => `<td>${car.transmission}</td>`).join('')}
                </tr>
                <tr>
                    <td>Привод</td>
                    ${comparisonList.map(car => `<td>${car.drive}</td>`).join('')}
                </tr>
                <tr>
                    <td>Расход</td>
                    ${comparisonList.map(car => `<td>${car.consumption} л/100км</td>`).join('')}
                </tr>
                <tr>
                    <td>Действия</td>
                    ${comparisonList.map(car => `
                        <td>
                            <button class="btn-card btn-details" style="margin-bottom: 5px; width: 100%;" onclick="showCarDetails(${car.id})">Подробнее</button>
                            <button class="btn-testdrive" style="margin-top: 0;" onclick="openTestDriveModal(${car.id})">Тест-драйв</button>
                        </td>
                    `).join('')}
                </tr>
            </tbody>
        </table>
    `;
    
    compareGrid.appendChild(comparisonTable);
}

function clearComparison() {
    comparisonList = [];
    updateComparisonBadge();
    saveComparisonList();
    displayComparisonCards();
    displayCars();
    showNotification('Список сравнения очищен', 'info');
}

// ==================== ПОИСК И ФИЛЬТРАЦИЯ ====================

function applyFilters() {
    const brand = document.getElementById('brandFilter').value;
    const year = document.getElementById('yearFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    
    const filteredCars = carsData.filter(car => {
        if (brand !== 'Все марки' && car.brand !== brand) return false;
        if (year !== 'Любой год' && car.year !== parseInt(year)) return false;
        
        if (priceRange !== 'Любая цена') {
            const price = car.price;
            switch(priceRange) {
                case 'до 1 000 000 ₽':
                    if (price > 1000000) return false;
                    break;
                case '1 000 000 - 2 000 000 ₽':
                    if (price < 1000000 || price > 2000000) return false;
                    break;
                case '2 000 000 - 3 000 000 ₽':
                    if (price < 2000000 || price > 3000000) return false;
                    break;
                case '3 000 000 - 5 000 000 ₽':
                    if (price < 3000000 || price > 5000000) return false;
                    break;
                case 'более 5 000 000 ₽':
                    if (price < 5000000) return false;
                    break;
            }
        }
        return true;
    });
    
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = filteredCars.map(car => createCarCard(car)).join('');
    
    if (filteredCars.length === 0) {
        carsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><p style="color: #999; font-size: 18px;">Автомобили не найдены</p></div>';
    }
}

function filterByBrand(brand) {
    document.getElementById('brandFilter').value = brand;
    applyFilters();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        displayCars();
        return;
    }
    
    const searchResults = carsData.filter(car => 
        car.brand.toLowerCase().includes(searchTerm) || 
        car.model.toLowerCase().includes(searchTerm) ||
        car.year.toString().includes(searchTerm)
    );
    
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = searchResults.map(car => createCarCard(car)).join('');
    
    if (searchResults.length === 0) {
        carsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><p style="color: #999; font-size: 18px;">Ничего не найдено</p></div>';
    }
}

// ==================== УВЕДОМЛЕНИЯ ====================

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==================== МАСКА ТЕЛЕФОНА ====================

function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 1) {
                    value = `+7 (${value}`;
                } else if (value.length <= 4) {
                    value = `+7 (${value.slice(1, 4)}`;
                } else if (value.length <= 7) {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}`;
                } else if (value.length <= 9) {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}`;
                } else {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
                }
                e.target.value = value;
            }
        });
    });
}

// ==================== ПРОВЕРКА СЕССИИ ====================

function checkSavedSession() {
    const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUIForLoggedInUser();
        } catch (e) {
            console.error('Ошибка загрузки сессии');
        }
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    displayCars();
    initPhoneMask();
    checkSavedSession();
    updateComparisonBadge();
    
    // Закрытие выпадающего меню
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            closeUserDropdown();
        }
    });
    
    // Закрытие модальных окон по клику вне их
    document.addEventListener('click', function(e) {
        const modals = ['authModal', 'profileModal', 'favoritesModal', 'historyModal', 'testDriveHistoryModal', 'compareModal', 'testDriveModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (e.target === modal) {
                if (modalId === 'authModal') closeAuthModal();
                else if (modalId === 'profileModal') closeProfileModal();
                else if (modalId === 'favoritesModal') closeFavoritesModal();
                else if (modalId === 'historyModal') closeHistoryModal();
                else if (modalId === 'testDriveHistoryModal') closeTestDriveHistoryModal();
                else if (modalId === 'compareModal') closeCompareModal();
                else if (modalId === 'testDriveModal') closeTestDriveModal();
            }
        });
        
        if (e.target.classList.contains('modal') && e.target.id === 'carModal') {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAuthModal();
            closeProfileModal();
            closeFavoritesModal();
            closeHistoryModal();
            closeTestDriveHistoryModal();
            closeCompareModal();
            closeTestDriveModal();
            closeModal();
        }
    });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});