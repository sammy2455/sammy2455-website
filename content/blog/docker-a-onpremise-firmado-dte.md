---
title: "De Docker a On-Premise: optimizando el firmado de DTE en El Salvador"
title_en: "From Docker to On-Premise: optimizing DTE signing in El Salvador"
date: "2025-02-10"
tags: ["Java", "DevOps", "Docker", "Facturación electrónica"]
description: "Cómo migramos el algoritmo de firmado de documentos tributarios electrónicos de un contenedor Docker a un entorno On-Premise en Java, reduciendo la latencia de firma en un 60%."
description_en: "How we migrated the electronic tax document signing algorithm from a Docker container to an On-Premise Java environment, reducing signing latency by 60%."
---

## El problema

En el sistema de facturación electrónica para El Salvador que desarrollamos en **Acatha S.A.**, el proceso de firmado de DTE (Documentos Tributarios Electrónicos) corría dentro de un contenedor Docker. Funcionaba, pero teníamos latencias de entre **800ms y 1.2s** por documento firmado.

Para volúmenes altos — emisores que generan cientos de facturas por hora — eso es inaceptable.

## El diagnóstico

Después de profiling con **Java Flight Recorder** identificamos tres cuellos de botella:

1. **Overhead del networking** entre el microservicio consumidor y el contenedor firmador.
2. **Cold starts** frecuentes del JVM dentro del contenedor al escalar horizontalmente.
3. **Latencia I/O** en la lectura del keystore desde un volumen montado.

```java
// Antes: lectura del keystore en cada firma
KeyStore ks = KeyStore.getInstance("PKCS12");
try (InputStream is = new FileInputStream(keystorePath)) {
    ks.load(is, password);
}
```

Cada invocación abría, leía y cerraba el keystore. En carga alta: miles de operaciones de disco innecesarias.

## La solución

Migramos el servicio a **On-Premise** con las siguientes optimizaciones:

### 1. Keystore cacheado en memoria

```java
@Component
public class KeystoreCache {

    private final KeyStore keyStore;
    private final PrivateKey privateKey;
    private final X509Certificate certificate;

    public KeystoreCache(
        @Value("${signing.keystore-path}") String path,
        @Value("${signing.keystore-password}") String password,
        @Value("${signing.key-alias}") String alias
    ) throws Exception {
        this.keyStore = KeyStore.getInstance("PKCS12");
        try (InputStream is = new FileInputStream(path)) {
            this.keyStore.load(is, password.toCharArray());
        }
        this.privateKey = (PrivateKey) keyStore.getKey(alias, password.toCharArray());
        this.certificate = (X509Certificate) keyStore.getCertificate(alias);
    }

    public PrivateKey getPrivateKey() { return privateKey; }
    public X509Certificate getCertificate() { return certificate; }
}
```

### 2. Pool de instancias `Signature`

`java.security.Signature` no es thread-safe. En vez de crear una instancia por request, usamos un pool:

```java
private final BlockingQueue<Signature> signaturePool = new LinkedBlockingQueue<>();

private Signature borrowSignature() throws Exception {
    Signature sig = signaturePool.poll();
    if (sig == null) {
        sig = Signature.getInstance("SHA256withRSA");
    }
    sig.initSign(keystoreCache.getPrivateKey());
    return sig;
}

private void returnSignature(Signature sig) {
    signaturePool.offer(sig);
}
```

## Resultados

| Métrica              | Docker (antes) | On-Premise (después) |
|----------------------|---------------|----------------------|
| Latencia promedio    | 950ms         | **380ms**            |
| P99                  | 1.4s          | **610ms**            |
| Throughput (docs/s)  | ~105          | **~260**             |
| CPU en carga alta    | 78%           | **42%**              |

Una reducción del **60% en latencia** y del **46% en uso de CPU**.

## Conclusión

Docker es excelente para aislamiento y portabilidad, pero cuando el rendimiento es crítico y el entorno es controlado, ejecutar directamente sobre la JVM del host elimina capas innecesarias de indirección.

El patrón de cachear recursos costosos en el inicio de la aplicación (keystore, conexiones, pools) es uno de los más impactantes que puedes aplicar en servicios Java de alta frecuencia.

---

*¿Tienes un caso similar? Escríbeme en [LinkedIn](https://www.linkedin.com/in/sammy2455/) o por [email](mailto:jhonnyalbert245@gmail.com).*
