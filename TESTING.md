# 🧪 Guide de Tests - Système de Gestion Clinique

## 📋 Vue d'Ensemble

Ce projet inclut des tests unitaires complets pour le backend (Spring Boot + Mockito) et le frontend (React + Vitest).

---

## 🔧 Backend Tests (Spring Boot + Mockito)

### Configuration

**Framework**: JUnit 5 + Mockito + AssertJ  
**Base de données test**: H2 (in-memory)  
**Coverage cible**: 80%+

### Structure des Tests

```
springBoot/src/test/java/
├── com/example/GestionClinique/
│   ├── service/
│   │   └── PatientServiceTest.java
│   └── exception/
│       └── GlobalExceptionHandlerTest.java
└── resources/
    └── application.properties (test config)
```

### Dépendances Ajoutées

```xml
<!-- H2 Database for testing -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>

<!-- AssertJ for fluent assertions -->
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <scope>test</scope>
</dependency>
```

### Lancer les Tests Backend

```bash
# Tous les tests
mvn test

# Tests spécifiques
mvn test -Dtest=PatientServiceTest

# Avec coverage
mvn test jacoco:report

# Skip tests (pour build rapide)
mvn clean install -DskipTests
```

### Exemple de Test (PatientServiceTest)

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("Patient Service Tests")
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientServiceImpl patientService;

    @Test
    @DisplayName("Should create patient successfully")
    void testCreatePatient_Success() {
        // Given
        when(patientRepository.save(any(Patient.class)))
            .thenReturn(testPatient);

        // When
        Patient created = patientService.createPatient(testPatient);

        // Then
        assertThat(created).isNotNull();
        assertThat(created.getNom()).isEqualTo("Nguemo");
        verify(patientRepository, times(1)).save(any(Patient.class));
    }
}
```

### Tests Créés

#### ✅ PatientServiceTest (15 tests)

- ✅ Create patient successfully
- ✅ Throw exception for null data
- ✅ Find patient by ID
- ✅ Throw ResourceNotFoundException when not found
- ✅ Find all patients
- ✅ Return empty list when no patients
- ✅ Update patient successfully
- ✅ Throw exception when updating non-existent patient
- ✅ Delete patient successfully
- ✅ Throw exception when deleting non-existent patient
- ✅ Find patients by name
- ✅ Validate email format
- ✅ Validate age range
- ✅ Validate required fields

#### ✅ GlobalExceptionHandlerTest (4 tests)

- ✅ Handle ResourceNotFoundException with 404
- ✅ Handle BusinessException with 400
- ✅ Handle generic Exception with 500
- ✅ Include timestamp and path in error response

---

## ⚛️ Frontend Tests (React + Vitest)

### Configuration

**Framework**: Vitest + React Testing Library  
**Environment**: jsdom  
**Coverage cible**: 80%+

### Structure des Tests

```
react/src/tests/
├── setup.js (configuration globale)
├── PageLogin.test.jsx
└── authService.test.js
```

### Dépendances Ajoutées

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@vitest/ui": "^1.0.4",
    "jsdom": "^23.0.1",
    "vitest": "^1.0.4"
  }
}
```

### Scripts NPM

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Lancer les Tests Frontend

```bash
# Mode watch (recommandé pour dev)
npm test

# Run once
npm test -- --run

# Avec UI interactive
npm run test:ui

# Avec coverage
npm run test:coverage

# Tests spécifiques
npm test -- PageLogin
```

### Configuration Vitest (vite.config.js)

```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/tests/"],
    },
  },
});
```

### Exemple de Test (PageLogin)

```javascript
describe("PageLogin Component", () => {
  it("should render login form", () => {
    render(<PageLogin />);

    expect(
      screen.getByRole("heading", { name: /connexion/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /se connecter/i })
    ).toBeInTheDocument();
  });

  it("should update email input value", () => {
    render(<PageLogin />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    expect(emailInput.value).toBe("test@example.com");
  });
});
```

### Tests Créés

#### ✅ PageLogin.test.jsx (10 tests)

- ✅ Render login form
- ✅ Update email input value
- ✅ Update password input value
- ✅ Show validation error for empty email
- ✅ Show validation error for invalid email format
- ✅ Toggle password visibility
- ✅ Call login API on form submit
- ✅ Display error message on login failure
- ✅ Disable submit button while loading
- ✅ Have proper accessibility attributes

#### ✅ authService.test.js (12 tests)

- ✅ Login successfully and store tokens
- ✅ Throw error on login failure
- ✅ Clear tokens on logout
- ✅ Return true when token exists (isAuthenticated)
- ✅ Return false when no token (isAuthenticated)
- ✅ Return stored token (getToken)
- ✅ Return null when no token (getToken)
- ✅ Refresh token successfully
- ✅ Logout on refresh failure
- ✅ Return current user from localStorage
- ✅ Return null when no user stored
- ✅ Check user roles correctly

---

## 📊 Coverage

### Backend Coverage

```bash
mvn test jacoco:report
# Rapport: target/site/jacoco/index.html
```

**Objectifs:**

- Line Coverage: > 80%
- Branch Coverage: > 75%
- Method Coverage: > 85%

### Frontend Coverage

```bash
npm run test:coverage
# Rapport: coverage/index.html
```

**Objectifs:**

- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## 🎯 Bonnes Pratiques

### Backend (JUnit + Mockito)

1. **Nommage des tests**

   ```java
   @DisplayName("Should create patient successfully")
   void testCreatePatient_Success()
   ```

2. **Structure Given-When-Then**

   ```java
   // Given
   when(repository.save(any())).thenReturn(entity);

   // When
   Result result = service.method();

   // Then
   assertThat(result).isNotNull();
   verify(repository, times(1)).save(any());
   ```

3. **Assertions fluides avec AssertJ**

   ```java
   assertThat(patient)
       .isNotNull()
       .extracting("nom", "email")
       .containsExactly("Nguemo", "jean@email.com");
   ```

4. **Tester les exceptions**
   ```java
   assertThatThrownBy(() -> service.method())
       .isInstanceOf(ResourceNotFoundException.class)
       .hasMessageContaining("not found");
   ```

### Frontend (Vitest + Testing Library)

1. **Queries prioritaires**

   ```javascript
   // ✅ Bon (accessible)
   screen.getByRole("button", { name: /submit/i });
   screen.getByLabelText(/email/i);

   // ❌ Éviter
   screen.getByClassName("btn-submit");
   ```

2. **Async/Await pour actions asynchrones**

   ```javascript
   await waitFor(() => {
     expect(screen.getByText(/success/i)).toBeInTheDocument();
   });
   ```

3. **User Events plutôt que fireEvent**

   ```javascript
   import userEvent from "@testing-library/user-event";

   const user = userEvent.setup();
   await user.type(emailInput, "test@email.com");
   await user.click(submitButton);
   ```

4. **Mocking avec vi**
   ```javascript
   vi.mock("../services/api", () => ({
     fetchData: vi.fn().mockResolvedValue(mockData),
   }));
   ```

---

## 🔍 Debugging Tests

### Backend

```bash
# Mode debug Maven
mvnDebug test

# Logs détaillés
mvn test -X

# Test spécifique avec logs
mvn test -Dtest=PatientServiceTest#testCreatePatient_Success -X
```

### Frontend

```bash
# Mode debug
npm test -- --inspect

# UI interactive (meilleur pour debug)
npm run test:ui

# Logs détaillés
DEBUG=* npm test
```

---

## 📝 Ajouter de Nouveaux Tests

### Backend

1. Créer le fichier test dans `src/test/java/`
2. Annoter avec `@ExtendWith(MockitoExtension.class)`
3. Mocker les dépendances avec `@Mock`
4. Injecter le service avec `@InjectMocks`
5. Écrire les tests avec `@Test` et `@DisplayName`

### Frontend

1. Créer le fichier test dans `src/tests/`
2. Importer `describe`, `it`, `expect` de vitest
3. Importer `render`, `screen` de @testing-library/react
4. Écrire les tests avec `describe` et `it`

---

## ✅ Checklist Tests

### Avant Commit

- [ ] Tous les tests passent (`mvn test` + `npm test`)
- [ ] Coverage > 80%
- [ ] Pas de tests skippés
- [ ] Pas de console.log dans les tests

### Avant PR

- [ ] Tests pour nouveaux features
- [ ] Tests pour bug fixes
- [ ] Documentation mise à jour
- [ ] Coverage maintenu ou amélioré

### Avant Release

- [ ] Tests E2E passent
- [ ] Tests de performance OK
- [ ] Tests de sécurité OK
- [ ] Tous les environnements testés

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 21
        uses: actions/setup-java@v2
        with:
          java-version: "21"
      - name: Run tests
        run: mvn test
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test -- --run
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## 📚 Ressources

### Backend

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [AssertJ Documentation](https://assertj.github.io/doc/)

### Frontend

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2 Janvier 2026
