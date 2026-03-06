import ExpoModulesCore
import Vision
import UIKit

public class EvolgritVisionModule: Module {
  public func definition() -> ModuleDefinition {
    Name("EvolgritVision")

    AsyncFunction("extractSubjectCutoutAsync") { (imageUri: String) -> String in
      guard #available(iOS 17.0, *) else {
        throw NSError(domain: "EvolgritVision", code: 1, userInfo: [NSLocalizedDescriptionKey: "iOS 17 required"])
      }

      let url = URL(fileURLWithPath: imageUri.replacingOccurrences(of: "file://", with: ""))
      guard let data = try? Data(contentsOf: url), let uiImage = UIImage(data: data) else {
        throw NSError(domain: "EvolgritVision", code: 2, userInfo: [NSLocalizedDescriptionKey: "Invalid image"])
      }
      guard let cgImage = uiImage.cgImage else {
        throw NSError(domain: "EvolgritVision", code: 3, userInfo: [NSLocalizedDescriptionKey: "No CGImage"])
      }

      let request = VNGenerateForegroundInstanceMaskRequest()
      let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
      try handler.perform([request])

      guard let result = request.results?.first else {
        throw NSError(domain: "EvolgritVision", code: 4, userInfo: [NSLocalizedDescriptionKey: "No mask result"])
      }

      let pixelBuffer = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)

      let ciImage = CIImage(cgImage: cgImage)
      let maskImage = CIImage(cvPixelBuffer: pixelBuffer)
      let resizedMask = maskImage.transformed(by: CGAffineTransform(scaleX: ciImage.extent.width / maskImage.extent.width, y: ciImage.extent.height / maskImage.extent.height))

      let transparent = CIImage(color: .clear).cropped(to: ciImage.extent)
      let composited = ciImage.applyingFilter("CIBlendWithAlphaMask", parameters: [
        kCIInputMaskImageKey: resizedMask,
        kCIInputBackgroundImageKey: transparent
      ])

      let context = CIContext()
      guard let outputCG = context.createCGImage(composited, from: ciImage.extent) else {
        throw NSError(domain: "EvolgritVision", code: 5, userInfo: [NSLocalizedDescriptionKey: "Failed to render"])
      }

      let outputImage = UIImage(cgImage: outputCG)
      guard let pngData = outputImage.pngData() else {
        throw NSError(domain: "EvolgritVision", code: 6, userInfo: [NSLocalizedDescriptionKey: "PNG encode failed"])
      }

      let filename = "snap_cutout_\(UUID().uuidString).png"
      let cacheDir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
      let outUrl = cacheDir.appendingPathComponent(filename)
      try pngData.write(to: outUrl)

      return outUrl.absoluteString
    }
  }
}
