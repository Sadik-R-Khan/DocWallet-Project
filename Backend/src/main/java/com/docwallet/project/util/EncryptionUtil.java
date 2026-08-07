package com.docwallet.project.util;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;

@Component
public class EncryptionUtil {
    private static final String algo = "AES";

    @Value("${encryption.secret}")
    private String secretKey;

    public byte[] encrypt(byte[] data) throws Exception{
        Key key = new SecretKeySpec(secretKey.getBytes(), algo);
        Cipher cipher = Cipher.getInstance(algo);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(data);
    }

    public byte[] decrypt(byte[] encryptedData) throws Exception{
        Key key = new SecretKeySpec(secretKey.getBytes(), algo);
        Cipher cipher = Cipher.getInstance(algo);
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher.doFinal(encryptedData);
    }
}
